import React from 'react'
import './HeroPanel.css'

function HeroPanel({ hero, damaged }) {
  if (!hero) return null

  return (
    <div className={`hero-panel${damaged ? ' shake' : ''}`}>
      <div className="name-bar">{hero.name}</div>
      <img className="card-image" src={hero.image} alt={hero.name} />
      <div className="stats-bar">
        <div className="stat">
          <img src="/boot.png" alt="move" />{hero.movement}
        </div>
        <div className="stat">
          <img src="/icon/starburst.png" alt="ap" />{hero.ap}
        </div>
        <div className="stat">
          <img src="/fist.png" alt="strength" />{hero.attack}
        </div>
        <div className="stat">
          <img src="/speed.png" alt="agility" />{hero.agility}
        </div>
        <div className="stat">
          <img src="/dice.png" alt="strength dice" />{hero.strengthDice}
        </div>
        <div className="stat">
          <img src="/dice.png" alt="agility dice" />{hero.agilityDice}
        </div>
        <div className="stat">
          <img src="/dice.png" alt="magic dice" />{hero.magicDice}
        </div>
      </div>
      <div className="hp-hearts">
        {Array.from({ length: hero.hp }, (_, i) => (
          <img key={i} src="/heart.png" alt="hp" />
        ))}
      </div>
      <div className="defence-badge">
        <img src="/shield.png" alt="defence" />
        <span>{hero.defence}</span>
      </div>
      <div className="description">{hero.skill}</div>
    </div>
  )
}

export default HeroPanel
