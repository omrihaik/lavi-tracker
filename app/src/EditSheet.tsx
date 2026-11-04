// FR-7: change an event's time or details, or delete it.
import { useState } from 'react'
import { ACTIVITIES, ML_PRESETS, RATINGS, describe } from './labels.ts'
import { Choices, Sheet } from './Sheet.tsx'
import { removeEvent, updateEvent } from './store.ts'
import { formatClock, withClock } from './time.ts'
import { TimePicker } from './TimePicker.tsx'
import type { LogEvent } from './types.ts'

export function EditSheet({ event, onClose }: { event: LogEvent; onClose: () => void }) {
  const [draft, setDraft] = useState<LogEvent>(event)
  const [clock, setClock] = useState(formatClock(event.at))

  const save = () => {
    updateEvent({ ...draft, at: withClock(event.at, clock) })
    onClose()
  }
  const remove = () => {
    removeEvent(event.id)
    onClose()
  }

  return (
    <Sheet title={describe(draft)} onClose={onClose}>
      <TimePicker value={clock} onChange={setClock} />

      {draft.type === 'feed' && (
        <>
          <Choices
            options={ML_PRESETS.map((ml) => ({ value: ml, label: `${ml}` }))}
            highlight={draft.ml}
            onPick={(ml) => setDraft({ ...draft, ml })}
          />
          <Choices options={RATINGS} highlight={draft.rating} onPick={(rating) => setDraft({ ...draft, rating })} />
        </>
      )}
      {draft.type === 'putdown' && (
        <Choices
          options={[
            { value: true, label: 'עם בכי' },
            { value: false, label: 'בלי בכי' },
          ]}
          highlight={draft.crying}
          onPick={(crying) => setDraft({ ...draft, crying })}
        />
      )}
      {draft.type === 'activity' && (
        <Choices
          options={ACTIVITIES}
          highlight={draft.activity}
          onPick={(activity) => setDraft({ ...draft, activity })}
        />
      )}

      <div className="sheet-actions">
        <button className="primary" disabled={!clock} onClick={save}>
          שמור
        </button>
        <button className="danger" onClick={remove}>
          מחק
        </button>
      </div>
    </Sheet>
  )
}
