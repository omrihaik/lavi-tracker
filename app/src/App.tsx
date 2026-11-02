import { useEffect, useState } from 'react'
import { lastFeed, sleepState } from './derive.ts'
import { EditSheet } from './EditSheet.tsx'
import { ACTIVITIES, ML_COMMON, ML_PRESETS, RATINGS, describe } from './labels.ts'
import { Choices, Sheet } from './Sheet.tsx'
import { addEvent, removeEvent, useEvents } from './store.ts'
import { HOUR, formatAgo, formatClock, formatDuration, startOfToday, useNow, withClock } from './time.ts'
import type { LogEvent, NewEvent } from './types.ts'

type Open =
  | null
  | { kind: 'feed'; ml?: number; other?: boolean }
  | { kind: 'putdown' }
  | { kind: 'activity' }
  | { kind: 'wake'; since: number }
  | { kind: 'edit'; event: LogEvent }

const LONG_SLEEP = 6 * HOUR // FR-2: after 6 hours, ask for the actual wake-up time

function App() {
  const events = useEvents()
  const now = useNow()
  const [open, setOpen] = useState<Open>(null)
  const [toast, setToast] = useState<LogEvent | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const sleep = sleepState(events)
  const feed = lastFeed(events)
  const today = events.filter((e) => e.at >= startOfToday(now)).reverse()

  const log = (e: NewEvent) => {
    setToast(addEvent(e))
    setOpen(null)
  }

  // FR-2: one tap — the button does whatever the current state calls for.
  const tapSleep = () => {
    if (!sleep.asleep) return log({ type: 'sleep_start', at: Date.now() })
    if (sleep.since && Date.now() - sleep.since > LONG_SLEEP) return setOpen({ kind: 'wake', since: sleep.since })
    log({ type: 'sleep_end', at: Date.now() })
  }

  return (
    <main className="app">
      {/* FR-6: live status */}
      <section className="status">
        <div>
          <span className="label">אכל לאחרונה</span>
          <strong>{feed ? formatAgo(now - feed.at) : '—'}</strong>
          {feed?.ml && <span className="sub">{feed.ml} מ״ל</span>}
        </div>
        <div>
          <span className="label">{sleep.asleep ? 'ישן' : 'ער'}</span>
          <strong>{sleep.since ? formatDuration(now - sleep.since) : '—'}</strong>
          {sleep.since && <span className="sub">מאז {formatClock(sleep.since)}</span>}
        </div>
      </section>

      {/* FR-1: four big buttons */}
      <section className="buttons">
        <button className={sleep.asleep ? 'big sleep asleep' : 'big sleep'} onClick={tapSleep}>
          {sleep.asleep ? 'התעורר' : 'נרדם'}
          {sleep.since && (
            <small>
              {sleep.asleep ? 'ישן' : 'ער'} {formatDuration(now - sleep.since)}
            </small>
          )}
        </button>
        <button className="big feed" onClick={() => setOpen({ kind: 'feed' })}>
          האכלה
        </button>
        <button className="big putdown" onClick={() => setOpen({ kind: 'putdown' })}>
          השכבה
        </button>
        <button className="big activity" onClick={() => setOpen({ kind: 'activity' })}>
          פעילות
        </button>
      </section>

      {/* FR-7: today's events, tap to edit */}
      <section className="today">
        <h2>היום</h2>
        {today.length === 0 && <p className="empty">עוד אין אירועים היום</p>}
        <ul>
          {today.map((e) => (
            <li key={e.id}>
              <button onClick={() => setOpen({ kind: 'edit', event: e })}>
                <span className="time">{formatClock(e.at)}</span>
                <span>{describe(e)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* FR-3: feeding — ml, then rating */}
      {open?.kind === 'feed' && !open.ml && (
        <Sheet title="כמה אכל? (מ״ל)" onClose={() => setOpen(null)}>
          {open.other ? (
            <form
              className="other"
              onSubmit={(e) => {
                e.preventDefault()
                const ml = Number(new FormData(e.currentTarget).get('ml'))
                if (ml > 0) setOpen({ kind: 'feed', ml })
              }}
            >
              <input name="ml" type="number" inputMode="numeric" min="1" autoFocus placeholder="מ״ל" />
              <button className="primary">המשך</button>
            </form>
          ) : (
            <>
              <Choices
                options={ML_PRESETS.map((ml) => ({ value: ml, label: `${ml}` }))}
                highlight={ML_COMMON}
                onPick={(ml) => setOpen({ kind: 'feed', ml })}
              />
              <button className="link" onClick={() => setOpen({ kind: 'feed', other: true })}>
                כמות אחרת
              </button>
            </>
          )}
        </Sheet>
      )}
      {open?.kind === 'feed' && open.ml && (
        <Sheet title={`${open.ml} מ״ל · איך הייתה ההאכלה?`} onClose={() => setOpen(null)}>
          <Choices options={RATINGS} onPick={(rating) => log({ type: 'feed', at: Date.now(), ml: open.ml, rating })} />
        </Sheet>
      )}

      {/* FR-4: put-down — optional, crying yes / no */}
      {open?.kind === 'putdown' && (
        <Sheet title="היה בכי?" onClose={() => setOpen(null)}>
          <Choices
            options={[
              { value: true, label: 'עם בכי' },
              { value: false, label: 'בלי בכי' },
            ]}
            onPick={(crying) => log({ type: 'putdown', at: Date.now(), crying })}
          />
        </Sheet>
      )}

      {/* FR-5: activity type */}
      {open?.kind === 'activity' && (
        <Sheet title="איזו פעילות?" onClose={() => setOpen(null)}>
          <Choices options={ACTIVITIES} onPick={(activity) => log({ type: 'activity', at: Date.now(), activity })} />
        </Sheet>
      )}

      {/* FR-2: long sleep — ask when he actually woke up */}
      {open?.kind === 'wake' && <WakeSheet since={open.since} onSave={log} onClose={() => setOpen(null)} />}

      {open?.kind === 'edit' && <EditSheet event={open.event} onClose={() => setOpen(null)} />}

      {/* FR-7: undo */}
      {toast && (
        <div className="toast" role="status">
          <span>נשמר: {describe(toast)}</span>
          <button
            onClick={() => {
              removeEvent(toast.id)
              setToast(null)
            }}
          >
            ביטול
          </button>
        </div>
      )}
    </main>
  )
}

function WakeSheet({ since, onSave, onClose }: { since: number; onSave: (e: NewEvent) => void; onClose: () => void }) {
  const now = useNow()
  const [clock, setClock] = useState(() => formatClock(now))
  let at = withClock(now, clock)
  if (at > now) at -= 24 * HOUR // a time later than now means yesterday
  const valid = clock !== '' && at > since

  return (
    <Sheet title={`ישן כבר ${formatDuration(now - since)}. מתי התעורר?`} onClose={onClose}>
      <label className="field">
        שעת התעוררות
        <input type="time" value={clock} onChange={(e) => setClock(e.target.value)} />
      </label>
      <div className="sheet-actions">
        <button className="primary" disabled={!valid} onClick={() => onSave({ type: 'sleep_end', at })}>
          שמור
        </button>
      </div>
      {!valid && <p className="hint">השעה מוקדמת משעת ההירדמות ({formatClock(since)})</p>}
    </Sheet>
  )
}

export default App
