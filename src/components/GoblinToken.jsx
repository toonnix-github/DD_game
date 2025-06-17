import React, { useState } from 'react'
import './GoblinToken.scss'
import GoblinCard from './GoblinCard'

function GoblinToken({ goblin }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="goblin-token"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img className="token-image" src={goblin.image} alt={goblin.name} />
      <div className="hp-hearts">
        {Array.from({ length: goblin.hp }, (_, i) => (
          <img key={i} src="/heart.png" alt="hp" />
        ))}
      </div>
      {goblin.defence > 0 && (
        <div className="defence-badge">
          <img src="/shield.png" alt="defence" />
          <span>{goblin.defence}</span>
        </div>
      )}
      {hover && (
        <div className="hover-card">
          <GoblinCard goblin={goblin} />
        </div>
      )}
    </div>
  )
}

export default GoblinToken
