import React from 'react'
import './GoblinToken.scss'

function GoblinToken({ goblin }) {
  return (
    <div className="goblin-token">
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
    </div>
  )
}

export default GoblinToken
