// Type the time: two boxes, the same on Android and iPhone. 24-hour, like the rest of the app.
import { useRef, useState } from 'react'

const pad = (s: string) => s.padStart(2, '0')
const inRange = (s: string, max: number) => /^\d{1,2}$/.test(s) && Number(s) <= max

/** Value is "HH:MM", or "" while the boxes don't hold a valid time. */
export function TimePicker({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const [start] = useState(() => value.split(':'))
  const [hour, setHour] = useState(start[0])
  const [minute, setMinute] = useState(start[1])
  const minuteRef = useRef<HTMLInputElement>(null)

  const update = (h: string, m: string) => {
    setHour(h)
    setMinute(m)
    onChange(inRange(h, 23) && inRange(m, 59) ? `${pad(h)}:${pad(m)}` : '')
  }

  return (
    <div className="time-picker">
      <label>
        <input
          aria-label="שעה"
          className={hour === '' || inRange(hour, 23) ? undefined : 'invalid'}
          inputMode="numeric"
          enterKeyHint="next"
          maxLength={2}
          value={hour}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => inRange(e.target.value, 23) && update(pad(e.target.value), minute)}
          onChange={(e) => {
            const h = e.target.value.replace(/\D/g, '')
            update(h, minute)
            // Two digits, or a digit no hour can continue from (3-9): move on to the minutes.
            if (h.length === 2 || Number(h) > 2) minuteRef.current?.focus()
          }}
        />
        <span>שעה</span>
      </label>
      <span className="time-colon">:</span>
      <label>
        <input
          ref={minuteRef}
          aria-label="דקות"
          className={minute === '' || inRange(minute, 59) ? undefined : 'invalid'}
          inputMode="numeric"
          enterKeyHint="done"
          maxLength={2}
          value={minute}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => inRange(e.target.value, 59) && update(hour, pad(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          onChange={(e) => {
            const m = e.target.value.replace(/\D/g, '')
            update(hour, m)
            // Done: close the keyboard so the save button is in view.
            if (m.length === 2) e.target.blur()
          }}
        />
        <span>דקות</span>
      </label>
    </div>
  )
}
