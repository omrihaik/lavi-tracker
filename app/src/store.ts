// Event storage, shared between both phones through Firestore (FR-6, FR-8).
// Same functions as the local-only version from 6.2 — the screens didn't change.
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { collection, deleteDoc, doc, onSnapshot, setDoc, writeBatch, type DocumentData } from 'firebase/firestore'
import { useSyncExternalStore } from 'react'
import { auth, db, googleProvider } from './firebase.ts'
import type { LogEvent, NewEvent } from './types.ts'

export type Session =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'no-access'; user: User }
  | { status: 'ready'; user: User }

const LEGACY_KEY = 'lavie.events.v1' // events logged on this phone before sync existed (6.2)
const eventsRef = collection(db, 'events')

const listeners = new Set<() => void>()
let events: LogEvent[] = []
let session: Session = { status: 'loading' }
let stopListening: (() => void) | null = null

function emit() {
  listeners.forEach((fn) => fn())
}

function setSession(next: Session) {
  session = next
  emit()
}

onAuthStateChanged(auth, (user) => {
  stopListening?.()
  stopListening = null
  events = []
  if (!user) return setSession({ status: 'signed-out' })

  setSession({ status: 'loading' })
  stopListening = onSnapshot(
    eventsRef,
    (snap) => {
      events = mergeImport(snap.docs.map((d) => d.data()))
      if (session.status !== 'ready') {
        setSession({ status: 'ready', user })
        void migrateLegacy()
      } else emit()
    },
    // Access rules reject anyone who isn't one of the two parents.
    () => setSession({ status: 'no-access', user }),
  )
})

// The Sheet's history lives in one document, so opening the app costs one read for it, not 1,100
// (the free plan allows 50,000 reads a day). The app is the source of truth from its first event on.
const IMPORT_ID = 'sheet-import'
type ImportDoc = { kind: 'sheet-import'; payload: string }
const isImport = (d: DocumentData): d is ImportDoc => d.kind === 'sheet-import'

function mergeImport(docs: DocumentData[]): LogEvent[] {
  const logged = docs.filter((d) => !isImport(d)) as LogEvent[]
  const bundle = docs.find(isImport)
  const firstLogged = Math.min(...logged.map((e) => e.at))
  const imported = bundle ? (JSON.parse(bundle.payload) as Omit<LogEvent, 'loggedBy' | 'loggedAt'>[]) : []
  const history = imported
    .filter((e) => e.at < firstLogged)
    .map((e) => ({ ...e, source: 'sheet', loggedBy: 'sheet', loggedAt: e.at }) as LogEvent)
  return [...history, ...logged].sort((a, b) => a.at - b.at)
}

export function saveImport(history: LogEvent[]) {
  void setDoc(doc(eventsRef, IMPORT_ID), { kind: 'sheet-import', payload: JSON.stringify(history) })
}

export function removeImport() {
  void deleteDoc(doc(eventsRef, IMPORT_ID))
}

/** One-time upload of events logged on this phone before sync existed. */
async function migrateLegacy() {
  let legacy: LogEvent[] = []
  try {
    legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? '[]') as LogEvent[]
  } catch {
    return
  }
  if (legacy.length === 0) return
  const batch = writeBatch(db)
  legacy.forEach((e) => batch.set(doc(eventsRef, e.id), e))
  await batch.commit()
  localStorage.removeItem(LEGACY_KEY)
}

// Some mobile browsers (e.g. Samsung Internet) block the sign-in popup — fall back to a full-page redirect.
const POPUP_FAILURES = ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request']

export async function signIn() {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err) {
    const code = (err as { code?: string }).code ?? ''
    if (POPUP_FAILURES.includes(code)) return signInWithRedirect(auth, googleProvider)
    throw err
  }
}

// Completes a redirect sign-in when the page loads again; errors surface on the sign-in screen.
export const redirectResult = getRedirectResult(auth)
export const signOut = () => fbSignOut(auth)

export function addEvent(e: NewEvent): LogEvent {
  const ref = doc(eventsRef)
  const created = { ...e, id: ref.id, loggedBy: auth.currentUser?.uid ?? 'unknown', loggedAt: Date.now() } as LogEvent
  // Not awaited: the write lands in the local cache immediately and syncs when online.
  void setDoc(ref, stripUndefined(created))
  return created
}

export function updateEvent(next: LogEvent) {
  void setDoc(doc(eventsRef, next.id), stripUndefined(next))
}

export function removeEvent(id: string) {
  void deleteDoc(doc(eventsRef, id))
}

// Firestore rejects fields whose value is `undefined`.
function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useEvents(): LogEvent[] {
  return useSyncExternalStore(subscribe, () => events)
}

export function useSession(): Session {
  return useSyncExternalStore(subscribe, () => session)
}
