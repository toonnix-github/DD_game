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
          <img src="/boot.png" alt="move" />
          <span>{hero.movement}</span>
        </div>
        <div className="stat">
          <img src="/heart.png" alt="hp" />
          <span>{hero.hp}</span>
        </div>
        <div className="stat">
          <img src="/icon/starburst.png" alt="ap" />
          <span>{hero.ap}</span>
        </div>
        <div className="stat">
          <img src="/fist.png" alt="strength" />
          <span>{hero.attack}</span>
        </div>
        <div className="stat">
          <img src="/shield.png" alt="defence" />
          <span>{hero.defence}</span>
        </div>
        <div className="stat">
          <img src="/speed.png" alt="agility" />
          <span>{hero.agility}</span>
        </div>
        <div className="stat">
          <img src="/dice.png" alt="strength dice" />
          <span>{hero.strengthDice}</span>
        </div>
        <div className="stat">
          <img src="/dice.png" alt="agility dice" />
          <span>{hero.agilityDice}</span>
        </div>
        <div className="stat">
          <img src="/dice.png" alt="magic dice" />
          <span>{hero.magicDice}</span>
        </div>
      </div>
      <div className="description">{hero.skill}</div>
    </div>
  )
}

export default HeroPanel
