import React from 'react'
import './GoblinCard.css'

function GoblinCard({ goblin, damaged, defeated }) {
  return (
    <div className={`goblin-card${damaged ? ' shake' : ''}`}>
      <div className="name-bar">{goblin.name}</div>
      <img className="card-image" src={goblin.image} alt={goblin.name} />
      {defeated && <img src="/skull.png" alt="defeated" className="death-effect red" />}
      <div className="hp-hearts">
        {Array.from({ length: goblin.hp }, (_, i) => (
          <img key={i} src="/heart.png" alt="hp" />
        ))}
      </div>
      <div className="stats-bar">
        <span className="stat">
          <img src="/fist.png" alt="attack" />{goblin.attack}
        </span>
      </div>
      <div className="defence-badge">
        <img src="/shield.png" alt="defence" />
        <span>{goblin.defence}</span>
      </div>
      <div className="monster-icon">
        <img src="/icon/icon-goblin.png" alt="goblin" />
      </div>
    </div>
  )
}

export default GoblinCard
