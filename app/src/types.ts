// The four event types from the PRD (FR-2 to FR-5). Sleep is stored as two events.
export type Rating = 'good' | 'ok' | 'hard'
export type ActivityKind = 'tummy' | 'trampoline' | 'skin' | 'talk' | 'unspecified' // unspecified: imported rows only

type Base = {
  id: string
  at: number // when it happened (ms)
  loggedBy: string // FR-9: who logged it
  loggedAt: number // FR-9: when it was logged
  source?: 'sheet' // imported from the Google Sheet (I-03); read-only, not counted as a parent's log
}

export type LogEvent =
  | (Base & { type: 'sleep_start' })
  | (Base & { type: 'sleep_end'; auto?: boolean }) // auto: filled in by a feeding, not tapped (FR-3)
  | (Base & { type: 'feed'; ml?: number; rating?: Rating })
  | (Base & { type: 'putdown'; crying?: boolean })
  | (Base & { type: 'activity'; activity: ActivityKind })

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
export type NewEvent = DistributiveOmit<LogEvent, 'id' | 'loggedBy' | 'loggedAt'>
