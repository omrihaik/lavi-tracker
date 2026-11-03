/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Firebase web config as JSON — app/.env.local locally, a GitHub secret in production. */
  readonly VITE_FIREBASE_CONFIG?: string
}
