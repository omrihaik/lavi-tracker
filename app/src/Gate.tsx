// FR-8: sign-in, and a clear screen when this Google account has no access yet.
import { useState, type ReactNode } from 'react'
import { signIn, signOut, useSession } from './store.ts'

export function Gate({ children }: { children: ReactNode }) {
  const session = useSession()
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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
            onClick={() => signIn().catch(() => setError('ההתחברות לא הצליחה. נסו שוב.'))}
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
