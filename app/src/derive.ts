// Live state computed from the event list (FR-2, FR-6).
import type { LogEvent } from './types.ts'

export type SleepState = { asleep: boolean; since: number | null }

export function sleepState(events: LogEvent[]): SleepState {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i]
    if (e.type === 'sleep_start') return { asleep: true, since: e.at }
    if (e.type === 'sleep_end') return { asleep: false, since: e.at }
  }
  return { asleep: false, since: null }
}

export function lastFeed(events: LogEvent[]) {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i]
    if (e.type === 'feed') return e
  }
  return null
}
