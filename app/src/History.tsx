// Every past day, newest first, including what was imported from the Sheet.
import { useMemo } from 'react'
import { Icon } from './Icon.tsx'
import { dayStart, sleepByDay, sleeps } from './insights.ts'
import { describe, eventIcon, kindOf } from './labels.ts'
import { formatClock, formatHours } from './time.ts'
import type { LogEvent } from './types.ts'

const formatDay = (ts: number) =>
  new Date(ts).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' })

export function History({ events, onEdit }: { events: LogEvent[]; onEdit: (e: LogEvent) => void }) {
  const days = useMemo(() => {
    const sleep = sleepByDay(sleeps(events))
    const byDay = new Map<number, LogEvent[]>()
    for (const e of [...events].reverse()) {
      if (e.type === 'dose') continue // the daily checklist lives on the Today screen
      const key = dayStart(e.at)
      byDay.set(key, [...(byDay.get(key) ?? []), e])
    }
    return [...byDay.entries()].map(([day, list]) => ({
      day,
      list,
      sleep: sleep.get(day),
      feeds: list.filter((e) => e.type === 'feed').length,
    }))
  }, [events])

  if (days.length === 0) return <p className="empty">עוד אין אירועים</p>

  return (
    <section className="scroll">
      {days.map(({ day, list, sleep, feeds }) => (
        <div className="history-day" key={day}>
          <h2>{formatDay(day)}</h2>
          <p className="hint">
            {sleep !== undefined && `שינה ${formatHours(sleep)} · `}
            {feeds === 1 ? 'האכלה אחת' : `${feeds} האכלות`}
          </p>
          <ul className="rows">
            {list.map((e) => (
              <li key={e.id}>
                {/* Imported rows are a record of the Sheet, so they stay as they are. */}
                <button className={kindOf(e)} disabled={e.source === 'sheet'} onClick={() => onEdit(e)}>
                  <Icon name={eventIcon(e)} />
                  <span className="time">{formatClock(e.at)}</span>
                  <span>{describe(e)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
