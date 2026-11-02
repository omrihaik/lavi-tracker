import type { ReactNode } from 'react'

/** Bottom sheet: choices slide up from the bottom, within thumb reach. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="close" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** A row of large, equal-width choice buttons. */
export function Choices<T>({
  options,
  onPick,
  highlight,
}: {
  options: { value: T; label: string }[]
  onPick: (value: T) => void
  highlight?: T
}) {
  return (
    <div className="choices">
      {options.map((o) => (
        <button
          key={String(o.value)}
          className={o.value === highlight ? 'choice highlight' : 'choice'}
          onClick={() => onPick(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
