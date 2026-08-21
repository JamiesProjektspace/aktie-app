import { useState } from 'react'

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="info-tooltip-wrapper">
      <button
        type="button"
        className="info-tooltip-icon"
        onClick={() => setOpen(o => !o)}
        aria-label="Vis forklaring"
      >
        i
      </button>
      {open && (
        <div className="info-tooltip-box">
          {text}
        </div>
      )}
    </span>
  )
}

export default InfoTooltip