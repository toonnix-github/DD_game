import React from 'react'
import './GameOverModal.scss'

function GameOverModal({ onReset }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-modal">
        <h1>Game Over</h1>
        <p>The torch has burned out and darkness has claimed the dungeon.</p>
        <button onClick={onReset}>Start New Game</button>
      </div>
    </div>
  )
}

export default GameOverModal
