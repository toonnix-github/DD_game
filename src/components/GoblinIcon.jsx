import React from 'react'
import './GoblinIcon.scss'

function GoblinIcon({ row, col, icon }) {
  return (
    <div
      className="goblin-overlay"
      style={{ transform: `translate(${col * 100}%, ${row * 100}%)` }}
    >
      <img className="goblin-icon" src={icon} alt="goblin" />
    </div>
  )
}

export default GoblinIcon
