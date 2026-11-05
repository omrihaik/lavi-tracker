import { useEffect, useState } from 'react'

const MINUTE = 60_000
export const HOUR = 60 * MINUTE

/** "40 דק׳" or "2:10 ש׳" */
export function formatDuration(ms: number): string {
  const minutes = Math.max(0, Math.floor(ms / MINUTE))
  if (minutes < 60) return `${minutes} דק׳`
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m} ש׳`
}

/** "עכשיו" or "לפני 2:10 ש׳" */
export function formatAgo(ms: number): string {
  return ms < MINUTE ? 'עכשיו' : `לפני ${formatDuration(ms)}`
}

/** "03:15" */
/** Minutes as hours and minutes: 750 → "12:30 ש׳". */
export function formatHours(minutes: number): string {
  const rounded = Math.round(minutes)
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')} ש׳`
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function startOfToday(now = Date.now()): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Same day as `ts`, with the clock set to "HH:MM". */
export function withClock(ts: number, hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(ts)
  d.setHours(h, m, 0, 0)
  return d.getTime()
}

/** Re-renders every 30 seconds so "2:10 ago" stays current. */
export function useNow(): number {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])
  return now
}
