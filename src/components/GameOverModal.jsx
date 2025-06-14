import React from 'react'
import './EncounterModal.scss'

function GameOverModal({ onReset }) {
  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>Game Over</h2>
        <div className="buttons">
          <button onClick={onReset}>Reset Game</button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
