import React, { useState } from 'react'
import ItemCard from './ItemCard'
import './EncounterModal.css'

function RewardModal({ reward, onConfirm }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>You got a reward!</h2>
        <p className="reward-info">
          1 random item{reward.hp ? ` and ${reward.hp} hp` : ''}
        </p>
        <div
          className={`reward-card ${revealed ? 'revealed' : ''}`}
          onClick={() => setRevealed(true)}
        >
          <div className="reward-inner">
            <div className="reward-face front">
              <div className="card-back">
                <img src="/star.svg" alt="Card back" />
              </div>
            </div>
            <div className="reward-face back">
              <ItemCard item={reward.item} />
            </div>
          </div>
        </div>
        <div className="buttons">
          {revealed ? (
            <button onClick={onConfirm}>OK</button>
          ) : (
            <button onClick={() => setRevealed(true)}>Reveal</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RewardModal
