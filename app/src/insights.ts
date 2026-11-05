// The numbers behind the History and Insights tabs. Pure functions: events in, answers out.
import type { LogEvent } from './types.ts'

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE
const MAX_SLEEP = 14 * 60 * MINUTE // longer means a wake-up was never logged, not a real sleep
const MAX_FALL_ASLEEP = 90 // minutes from put-down to asleep; longer means they weren't one attempt
export const MIN_DATA_POINTS = 5

export type Sleep = { start: number; end: number; auto: boolean }
export type Attempt = { at: number; minutes: number }

export const dayStart = (ts: number) => new Date(ts).setHours(0, 0, 0, 0)
const nextDay = (ts: number) => {
  const d = new Date(ts)
  d.setHours(24, 0, 0, 0) // not ts + DAY: a day can be 23 or 25 hours when the clocks change
  return d.getTime()
}
const addDays = (ts: number, n: number) => new Date(ts).setDate(new Date(ts).getDate() + n)
const average = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length

/** Pairs "fell asleep" with the "woke up" that follows it. Events must be sorted by time. */
export function sleeps(events: LogEvent[]): Sleep[] {
  const out: Sleep[] = []
  let start: number | null = null
  for (const e of events) {
    if (e.type === 'sleep_start') start = e.at
    if (e.type === 'sleep_end' && start !== null) {
      if (e.at > start && e.at - start <= MAX_SLEEP) out.push({ start, end: e.at, auto: e.auto === true })
      start = null
    }
  }
  return out
}

/** Minutes asleep per calendar day. A sleep across midnight counts in both days. */
export function sleepByDay(list: Sleep[]): Map<number, number> {
  const days = new Map<number, number>()
  for (const s of list) {
    let from = s.start
    while (from < s.end) {
      const to = Math.min(s.end, nextDay(from))
      const key = dayStart(from)
      days.set(key, (days.get(key) ?? 0) + (to - from) / MINUTE)
      from = to
    }
  }
  return days
}

/** Each put-down that led to sleep, with how long it took. Repeat tries count from the first one. */
export function attempts(events: LogEvent[]): Attempt[] {
  const out: Attempt[] = []
  let first: number | null = null
  for (const e of events) {
    if (e.type === 'putdown') first ??= e.at
    if (e.type === 'sleep_end') first = null
    if (e.type === 'sleep_start') {
      if (first !== null) {
        const minutes = (e.at - first) / MINUTE
        if (minutes <= MAX_FALL_ASLEEP) out.push({ at: first, minutes })
      }
      first = null
    }
  }
  return out
}

export type Enough = { minutes: number; average: number; day: number } | null

/** Q1: yesterday against his own average for the 7 days before it. */
export function sleepingEnough(events: LogEvent[], now: number): Enough {
  const byDay = sleepByDay(sleeps(events))
  const day = addDays(dayStart(now), -1)
  const minutes = byDay.get(day)
  const before = Array.from({ length: 7 }, (_, i) => byDay.get(addDays(day, -(i + 1)))).filter(
    (m): m is number => m !== undefined,
  )
  if (minutes === undefined || before.length < MIN_DATA_POINTS) return null
  return { minutes, average: average(before), day }
}

export type Week = {
  from: number
  to: number
  days: number
  sleep: number | null // average minutes per day
  longest: number | null // average longest stretch
  fallAsleep: number | null // average minutes; null below MIN_DATA_POINTS
}

/** Q3: complete 7-day blocks, newest first, ending yesterday. */
export function weeks(events: LogEvent[], now: number, count = 6): Week[] {
  const list = sleeps(events)
  const byDay = sleepByDay(list)
  const tries = attempts(events)
  const lastDay = addDays(dayStart(now), -1)
  return Array.from({ length: count }, (_, i) => {
    const to = addDays(lastDay, -7 * i) // first millisecond of the block's last day
    const from = addDays(to, -6)
    const end = addDays(to, 1)
    const inWeek = (ts: number) => ts >= from && ts < end
    const days = [...byDay.keys()].filter(inWeek)
    const longestPerDay = new Map<number, number>()
    for (const s of list.filter((x) => inWeek(x.start))) {
      const key = dayStart(s.start)
      longestPerDay.set(key, Math.max(longestPerDay.get(key) ?? 0, (s.end - s.start) / MINUTE))
    }
    const weekTries = tries.filter((t) => inWeek(t.at)).map((t) => t.minutes)
    return {
      from,
      to,
      days: days.length,
      sleep: days.length ? average(days.map((d) => byDay.get(d) ?? 0)) : null,
      longest: longestPerDay.size ? average([...longestPerDay.values()]) : null,
      fallAsleep: weekTries.length >= MIN_DATA_POINTS ? average(weekTries) : null,
    }
  })
}

export type Slot = { from: number; to: number; minutes: number; count: number }

/** Q2: evening put-downs by 2-hour slot, fastest first. Only slots with enough data. */
export function bestBedtime(events: LogEvent[]): { slots: Slot[]; total: number } {
  const evening = attempts(events).filter((a) => new Date(a.at).getHours() >= 16)
  const slots = [16, 18, 20, 22].map((from) => {
    const inSlot = evening.filter((a) => {
      const h = new Date(a.at).getHours()
      return h >= from && h < from + 2
    })
    return { from, to: from + 2, count: inSlot.length, minutes: inSlot.length ? average(inSlot.map((a) => a.minutes)) : 0 }
  })
  return {
    slots: slots.filter((s) => s.count >= MIN_DATA_POINTS).sort((a, b) => a.minutes - b.minutes),
    total: evening.length,
  }
}

export type Health = { sleeps: number; complete: number; tapped: number } | null

/** The North Star over the last 7 days: `complete` counts automatic wake-ups, `tapped` doesn't. */
export function dataHealth(events: LogEvent[], now: number): Health {
  const since = now - 7 * DAY
  const recent = events.filter((e) => e.at >= since)
  const started = recent.filter((e) => e.type === 'sleep_start').length
  if (started === 0) return null
  const closed = sleeps(recent)
  return {
    sleeps: started,
    complete: Math.round((closed.length / started) * 100),
    tapped: Math.round((closed.filter((s) => !s.auto).length / started) * 100),
  }
}
