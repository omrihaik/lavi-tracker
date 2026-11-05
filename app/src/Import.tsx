// I-03: one-time import. Open the app with #import on a computer and pick the file from data/.
// The file stays on the computer and goes only to the private database, never through GitHub.
import { useState } from 'react'
import { removeImport, saveImport } from './store.ts'
import type { LogEvent } from './types.ts'

const TYPES = ['sleep_start', 'sleep_end', 'feed', 'putdown', 'activity']
const valid = (e: LogEvent) => typeof e.id === 'string' && typeof e.at === 'number' && TYPES.includes(e.type)

export function Import() {
  const [events, setEvents] = useState<LogEvent[] | null>(null)
  const [message, setMessage] = useState('')

  const read = async (file: File | undefined) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as LogEvent[]
      if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(valid)) throw new Error('bad file')
      setEvents(parsed)
      setMessage(`נמצאו ${parsed.length} אירועים`)
    } catch {
      setEvents(null)
      setMessage('הקובץ לא תקין')
    }
  }

  return (
    <main className="app gate">
      <h1>ייבוא מהטבלה</h1>
      <input type="file" accept=".json" aria-label="קובץ ייבוא" onChange={(e) => void read(e.target.files?.[0])} />
      {message && <p>{message}</p>}
      <button
        className="primary"
        disabled={!events}
        onClick={() => {
          if (!events) return
          saveImport(events)
          setMessage('הייבוא נשמר')
        }}
      >
        ייבא
      </button>
      <button
        className="danger"
        onClick={() => {
          removeImport()
          setMessage('הייבוא נמחק')
        }}
      >
        מחק ייבוא קודם
      </button>
      <a className="link" href="./">
        חזרה לאפליקציה
      </a>
    </main>
  )
}
