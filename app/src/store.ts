// Event storage. For now: this phone only (localStorage).
// Step 6.3 replaces the inside of this file with Firebase; the functions stay the same.
import { useSyncExternalStore } from 'react'
import type { LogEvent, NewEvent } from './types.ts'

const EVENTS_KEY = 'lavie.events.v1'
const DEVICE_KEY = 'lavie.device'

const listeners = new Set<() => void>()
let events: LogEvent[] = load()

function load(): LogEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) ?? '[]') as LogEvent[]
  } catch {
    return []
  }
}

function save(next: LogEvent[]) {
  events = [...next].sort((a, b) => a.at - b.at)
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  } catch {
    // storage full or blocked — keep the in-memory copy
  }
  listeners.forEach((fn) => fn())
}

function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(DEVICE_KEY, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

export function addEvent(e: NewEvent): LogEvent {
  const created = { ...e, id: crypto.randomUUID(), loggedBy: deviceId(), loggedAt: Date.now() } as LogEvent
  save([...events, created])
  return created
}

export function updateEvent(next: LogEvent) {
  save(events.map((e) => (e.id === next.id ? next : e)))
}

export function removeEvent(id: string) {
  save(events.filter((e) => e.id !== id))
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useEvents(): LogEvent[] {
  return useSyncExternalStore(subscribe, () => events)
}
