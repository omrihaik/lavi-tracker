import { useEffect, useState } from 'react'
import { lastFeed, sleepState } from './derive.ts'
import { EditSheet } from './EditSheet.tsx'
import { History } from './History.tsx'
import { Icon } from './Icon.tsx'
import { Insights } from './Insights.tsx'
import { ACTIVITIES, ML_COMMON, ML_PRESETS, RATINGS, describe, eventIcon, kindOf } from './labels.ts'
import { Choices, Sheet } from './Sheet.tsx'
import { addEvent, removeEvent, useEvents } from './store.ts'
import { HOUR, formatAgo, formatClock, formatDuration, startOfToday, useNow, withClock } from './time.ts'
import { TimePicker } from './TimePicker.tsx'
import type { LogEvent, NewEvent, Rating } from './types.ts'

type Open =
  | null
  | { kind: 'feed'; ml?: number; other?: boolean }
  | { kind: 'putdown' }
  | { kind: 'activity' }
  | { kind: 'wake'; since: number }
  | { kind: 'edit'; event: LogEvent }

const LONG_SLEEP = 6 * HOUR // FR-2: after 6 hours, ask for the actual wake-up time

type Tab = 'log' | 'history' | 'insights'
const TABS: { id: Tab; label: string }[] = [
  { id: 'log', label: 'היום' },
  { id: 'history', label: 'היסטוריה' },
  { id: 'insights', label: 'תובנות' },
]

// What the undo toast shows and removes: the event, plus a wake-up the feeding filled in.
type Toast = { event: LogEvent; wake?: LogEvent }

function App() {
  const events = useEvents()
  const now = useNow()
  const [open, setOpen] = useState<Open>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [tab, setTab] = useState<Tab>('log')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const sleep = sleepState(events)
  const feed = lastFeed(events)
  const today = events.filter((e) => e.at >= startOfToday(now)).reverse()

  const log = (e: NewEvent) => {
    setToast({ event: addEvent(e) })
    setOpen(null)
  }

  // FR-3: a feeding while he's marked asleep means he woke up. A long sleep asks for the time (FR-2).
  const logFeed = (ml: number, rating: Rating) => {
    const at = Date.now()
    const longSleep = sleep.asleep && sleep.since !== null && at - sleep.since > LONG_SLEEP
    const wake = sleep.asleep && !longSleep ? addEvent({ type: 'sleep_end', at: at - 1, auto: true }) : undefined
    setToast({ event: addEvent({ type: 'feed', at, ml, rating }), wake })
    setOpen(longSleep && sleep.since !== null ? { kind: 'wake', since: sleep.since } : null)
  }

  // FR-2: one tap — the button does whatever the current state calls for.
  const tapSleep = () => {
    if (!sleep.asleep) return log({ type: 'sleep_start', at: Date.now() })
    if (sleep.since && Date.now() - sleep.since > LONG_SLEEP) return setOpen({ kind: 'wake', since: sleep.since })
    log({ type: 'sleep_end', at: Date.now() })
  }

  return (
    <main className="app home">
      {tab === 'log' && (
        <>
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

          {/* FR-7: today's events, tap to edit */}
          <section className="today">
            <h2>היום</h2>
            {today.length === 0 && <p className="empty">עוד אין אירועים היום</p>}
            <ul className="rows">
              {today.map((e) => (
                <li key={e.id}>
                  <button className={kindOf(e)} disabled={e.source === 'sheet'} onClick={() => setOpen({ kind: 'edit', event: e })}>
                    <Icon name={eventIcon(e)} />
                    <span className="time">{formatClock(e.at)}</span>
                    <span>{describe(e)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* FR-1: four big buttons, fixed at the bottom within thumb reach */}
          <section className="buttons">
            <button className="big sleep" onClick={tapSleep}>
              <Icon name={sleep.asleep ? 'sun' : 'moon'} />
              {sleep.asleep ? 'התעורר' : 'נרדם'}
            </button>
            <button className="big feed" onClick={() => setOpen({ kind: 'feed' })}>
              <Icon name="feed" />
              האכלה
            </button>
            <button className="big putdown" onClick={() => setOpen({ kind: 'putdown' })}>
              <Icon name="putdown" />
              השכבה
            </button>
            <button className="big activity" onClick={() => setOpen({ kind: 'activity' })}>
              <Icon name="activity" />
              פעילות
            </button>
          </section>
        </>
      )}
      {tab === 'history' && <History events={events} onEdit={(event) => setOpen({ kind: 'edit', event })} />}
      {tab === 'insights' && <Insights events={events} now={now} />}

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={t.id === tab ? 'selected' : undefined} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

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
          <Choices options={RATINGS} onPick={(rating) => logFeed(open.ml as number, rating)} />
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
          <span>
            נשמר: {toast.wake && 'התעורר + '}
            {describe(toast.event)}
          </span>
          <button
            onClick={() => {
              removeEvent(toast.event.id)
              if (toast.wake) removeEvent(toast.wake.id)
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
  let at = clock ? withClock(now, clock) : 0
  if (at > now) at -= 24 * HOUR // a time later than now means yesterday
  const valid = at > since

  return (
    <Sheet title={`ישן כבר ${formatDuration(now - since)}. מתי התעורר?`} onClose={onClose}>
      <TimePicker value={clock} onChange={setClock} />
      <div className="sheet-actions">
        <button className="primary" disabled={!valid} onClick={() => onSave({ type: 'sleep_end', at })}>
          שמור
        </button>
      </div>
      {clock && !valid && <p className="hint">השעה מוקדמת משעת ההירדמות ({formatClock(since)})</p>}
    </Sheet>
  )
}

export default App
