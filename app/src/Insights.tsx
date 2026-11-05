// One screen, four answers (I-04). Below 5 data points an answer says so instead of guessing.
import { useMemo } from 'react'
import { MIN_DATA_POINTS, bestBedtime, dataHealth, foodWeeks, foodYesterday, sleepingEnough, weeks } from './insights.ts'
import { formatHours } from './time.ts'
import type { LogEvent } from './types.ts'

const notEnough = <p className="hint">אין עדיין מספיק נתונים</p>
const shortDate = (ts: number) => new Date(ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
const optional = (minutes: number | null) => (minutes === null ? '—' : formatHours(minutes))

// \u200E keeps the sign on the left of the number inside right-to-left text.
const signed = (diff: number, text: string) => `\u200E${diff >= 0 ? '+' : '−'}${text}`

function change(now: number | null, before: number | null) {
  if (now === null || before === null) return null
  const diff = Math.round(now - before)
  return signed(diff, formatHours(Math.abs(diff)))
}

const oneDecimal = (n: number) => n.toFixed(1)

export function Insights({ events, now }: { events: LogEvent[]; now: number }) {
  const { enough, recent, bedtime, health, ate, food } = useMemo(
    () => ({
      enough: sleepingEnough(events, now),
      recent: weeks(events, now).filter((w) => w.days >= MIN_DATA_POINTS),
      bedtime: bestBedtime(events),
      health: dataHealth(events, now),
      ate: foodYesterday(events, now),
      food: foodWeeks(events, now),
    }),
    // Recalculate when the data or the day changes, not every minute.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, new Date(now).toDateString()],
  )
  const [thisWeek, lastWeek] = recent
  const [foodNow, foodBefore] = food

  return (
    <section className="scroll">
      <article className="card">
        <h2>ישן מספיק?</h2>
        {enough ? (
          <>
            <strong>{formatHours(enough.minutes)}</strong>
            <p className="hint">
              אתמול, לעומת ממוצע {formatHours(enough.average)} ב-7 הימים שלפניו ({change(enough.minutes, enough.average)})
            </p>
          </>
        ) : (
          notEnough
        )}
      </article>

      <article className="card">
        <h2>משתפר?</h2>
        {thisWeek && lastWeek ? (
          <>
            <p className="hint">
              שינה ביום: {change(thisWeek.sleep, lastWeek.sleep)} · רצף ארוך: {change(thisWeek.longest, lastWeek.longest)}
            </p>
            <table>
              <thead>
                <tr>
                  <th>שבוע עד</th>
                  <th>שינה ביום</th>
                  <th>רצף ארוך</th>
                  <th>הירדמות</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((w) => (
                  <tr key={w.to}>
                    <td>{shortDate(w.to)}</td>
                    <td>{optional(w.sleep)}</td>
                    <td>{optional(w.longest)}</td>
                    <td>{w.fallAsleep === null ? '—' : `${Math.round(w.fallAsleep)} דק׳`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          notEnough
        )}
      </article>

      <article className="card">
        <h2>שעת שינה הכי טובה?</h2>
        {bedtime.slots.length > 0 ? (
          <>
            <strong>
              {bedtime.slots[0].from}:00–{bedtime.slots[0].to}:00
            </strong>
            <ul className="slots">
              {bedtime.slots.map((s) => (
                <li key={s.from}>
                  {s.from}:00–{s.to}:00 · נרדם תוך {Math.round(s.minutes)} דק׳ · {s.count} פעמים
                </li>
              ))}
            </ul>
          </>
        ) : (
          notEnough
        )}
      </article>

      <article className="card">
        <h2>כמה אכל?</h2>
        {ate ? (
          <>
            <strong>{ate.ml === null ? `${ate.feeds} האכלות` : `${Math.round(ate.ml)} מ״ל`}</strong>
            <p className="hint">
              אתמול{ate.ml !== null && `, ב-${ate.feeds} האכלות`}
              {ate.ml !== null && ate.measured < 100 && ` (כמות ב-${ate.measured}% מהן)`}
              {ate.ml === null && ` · כמות נרשמה ב-${ate.measured}% מההאכלות, לכן אין סיכום מ״ל`}
            </p>
          </>
        ) : (
          notEnough
        )}
        {food.length > 0 && (
          <>
            {foodNow && foodBefore && (
              <p className="hint">
                האכלות ביום: {signed(foodNow.feeds - foodBefore.feeds, oneDecimal(Math.abs(foodNow.feeds - foodBefore.feeds)))}
                {foodNow.ml !== null &&
                  foodBefore.ml !== null &&
                  ` · מ״ל ביום: ${signed(foodNow.ml - foodBefore.ml, String(Math.abs(Math.round(foodNow.ml - foodBefore.ml))))}`}
              </p>
            )}
            <table>
              <thead>
                <tr>
                  <th>שבוע עד</th>
                  <th>האכלות ביום</th>
                  <th>מ״ל ביום</th>
                  <th>עם כמות</th>
                </tr>
              </thead>
              <tbody>
                {food.map((w) => (
                  <tr key={w.to}>
                    <td>{shortDate(w.to)}</td>
                    <td>{oneDecimal(w.feeds)}</td>
                    <td>{w.ml === null ? '—' : Math.round(w.ml)}</td>
                    <td>{w.measured}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </article>

      {health && (
        <p className="hint health">
          תיעוד השבוע: {health.complete}% מהשינות שלמות ({health.tapped}% בלחיצה)
        </p>
      )}
    </section>
  )
}
