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

// What Lavie gets every day. Ticked on the Today screen, unticked again at midnight.
export const DAILY: { id: string; label: string }[] = [
  { id: 'vitamin_d', label: 'ויטמין D' },
  { id: 'normalax', label: 'נורמלקס' },
  { id: 'omeprazole', label: 'אסומפרזול' },
  { id: 'iron', label: 'טיפות ברזל' },
]

const ratingLabel = (r: Rating) => RATINGS.find((x) => x.value === r)?.label ?? ''
const activityLabel = (a: ActivityKind) => ACTIVITIES.find((x) => x.value === a)?.label ?? 'לא צוין'

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
    case 'dose':
      return `קיבל ${DAILY.find((d) => d.id === e.item)?.label ?? e.item}`
  }
}

/** The colour family of an event, shared by its button and its row in today's list. */
export function kindOf(e: LogEvent): 'sleep' | 'feed' | 'putdown' | 'activity' | 'dose' {
  return e.type === 'sleep_start' || e.type === 'sleep_end' ? 'sleep' : e.type
}

export function eventIcon(e: LogEvent): IconName {
  if (e.type === 'sleep_start') return 'moon'
  if (e.type === 'sleep_end') return 'sun'
  if (e.type === 'dose') return 'check'
  return e.type
}
