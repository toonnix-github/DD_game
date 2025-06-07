import React, { useState } from 'react'
import ItemCard from './ItemCard'
import './EncounterModal.css'

function DiscardModal({ items, onConfirm }) {
  const [discard, setDiscard] = useState(0)

  const confirm = () => {
    const kept = items.filter((_, idx) => idx !== discard)
    onConfirm(kept)
  }

  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>Inventory Full</h2>
        <div className="weapon-select">
          {items.map((it, idx) => (
            <label key={idx} className={`weapon-option ${discard === idx ? 'selected' : ''}`}>
              <input type="radio" checked={discard === idx} onChange={() => setDiscard(idx)} />
              <ItemCard item={it} />
            </label>
          ))}
        </div>
        <div className="buttons">
          <button onClick={confirm}>Discard</button>
        </div>
      </div>
    </div>
  )
}

export default DiscardModal
