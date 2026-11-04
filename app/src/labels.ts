import type { IconName } from './Icon.tsx'
import type { ActivityKind, LogEvent, Rating } from './types.ts'

export const ML_PRESETS = [120, 150, 180]
export const ML_COMMON = 150

export const RATINGS: { value: Rating; label: string }[] = [
  { value: 'good', label: 'טובה' },
  { value: 'ok', label: 'סבירה' },
  { value: 'hard', label: 'קשה' },
]

export const ACTIVITIES: { value: ActivityKind; label: string }[] = [
  { value: 'tummy', label: 'זמן בטן' },
  { value: 'trampoline', label: 'טרמפולינה' },
  { value: 'skin', label: 'עור לעור' },
  { value: 'talk', label: 'דיבור' },
]

const ratingLabel = (r: Rating) => RATINGS.find((x) => x.value === r)?.label ?? ''
const activityLabel = (a: ActivityKind) => ACTIVITIES.find((x) => x.value === a)?.label ?? ''

export function describe(e: LogEvent): string {
  switch (e.type) {
    case 'sleep_start':
      return 'נרדם'
    case 'sleep_end':
      return e.auto ? 'התעורר · אוטומטי' : 'התעורר'
    case 'feed':
      return ['האכלה', e.ml && `${e.ml} מ״ל`, e.rating && ratingLabel(e.rating)].filter(Boolean).join(' · ')
    case 'putdown':
      return ['השכבה', e.crying === undefined ? '' : e.crying ? 'עם בכי' : 'בלי בכי'].filter(Boolean).join(' · ')
    case 'activity':
      return `פעילות · ${activityLabel(e.activity)}`
  }
}

/** The colour family of an event, shared by its button and its row in today's list. */
export function kindOf(e: LogEvent): 'sleep' | 'feed' | 'putdown' | 'activity' {
  return e.type === 'sleep_start' || e.type === 'sleep_end' ? 'sleep' : e.type
}

export function eventIcon(e: LogEvent): IconName {
  if (e.type === 'sleep_start') return 'moon'
  if (e.type === 'sleep_end') return 'sun'
  return e.type
}
