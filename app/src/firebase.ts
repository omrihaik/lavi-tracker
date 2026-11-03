// Firebase setup. The config comes from VITE_FIREBASE_CONFIG:
// locally from app/.env.local, in production from the GitHub secret of the same name.
import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'

const config = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG ?? '{}')

export const app = initializeApp(config)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// FR-8: events logged offline are kept on the phone and synced when the connection returns.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
