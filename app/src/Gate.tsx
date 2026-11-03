// FR-8: sign-in, and a clear screen when this Google account has no access yet.
import { useEffect, useState, type ReactNode } from 'react'
import { redirectResult, signIn, signOut, useSession } from './store.ts'

// Show the real Firebase error code — "sign-in failed" alone can't be diagnosed.
const errorText = (err: unknown) =>
  `ההתחברות לא הצליחה (${(err as { code?: string }).code ?? 'unknown'}). נסו שוב.`

export function Gate({ children }: { children: ReactNode }) {
  const session = useSession()
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    redirectResult.catch((err) => setError(errorText(err)))
  }, [])

  if (session.status === 'ready') return children

  return (
    <main className="app gate">
      <h1>LavieTracker</h1>

      {session.status === 'loading' && <p className="hint">טוען…</p>}

      {session.status === 'signed-out' && (
        <>
          <p className="hint">התחברו פעם אחת בכל טלפון.</p>
          <button
            className="primary"
            onClick={() => {
              setError('')
              signIn().catch((err) => setError(errorText(err)))
            }}
          >
            התחברות עם Google
          </button>
          {error && <p className="hint">{error}</p>}
        </>
      )}

      {session.status === 'no-access' && (
        <>
          <p>
            מחוברים בתור <strong>{session.user.email}</strong>, אבל לחשבון הזה עוד אין גישה.
          </p>
          <p className="hint">שלחו את המזהה הזה כדי לקבל גישה:</p>
          <code className="uid">{session.user.uid}</code>
          <button
            className="primary"
            onClick={() =>
              navigator.clipboard
                .writeText(session.user.uid)
                .then(() => setCopied(true))
                .catch(() => setCopied(false))
            }
          >
            {copied ? 'הועתק' : 'העתקת המזהה'}
          </button>
          <button className="link" onClick={() => void signOut()}>
            התנתקות
          </button>
        </>
      )}
    </main>
  )
}
