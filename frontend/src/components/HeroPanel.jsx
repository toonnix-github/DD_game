import React from 'react'
import './HeroPanel.css'
import ItemCard from './ItemCard'

function HeroPanel({ hero }) {
  return (
    <div className="hero-panel">
      <h2>Hero</h2>
      <img
        src={hero.image}
        alt={hero.name}
        width="100"
        height="100"
        style={{ display: 'block', margin: '0 auto 8px' }}
      />
      <div className="stats">
        <img src="/boot.svg" alt="move" className="label-icon" />
        <div>{hero.movement}</div>
        <img src="/heart.svg" alt="hp" className="label-icon" />
        <div>{hero.hp}</div>
        <img src="/star.svg" alt="ap" className="label-icon" />
        <div>{hero.ap}</div>
        <img src="/fist.svg" alt="strength" className="label-icon" />
        <div className="icons">
          {Array.from({ length: hero.attack }, (_, i) => (
            <img key={i} src="/fist.svg" alt="strength" className="stat-icon" />
          ))}
        </div>
        <img src="/shield.svg" alt="defence" className="label-icon" />
        <div className="icons">
          {Array.from({ length: hero.defence }, (_, i) => (
            <img key={i} src="/shield.svg" alt="defence" className="stat-icon" />
          ))}
        </div>
        <img src="/wing.svg" alt="agility" className="label-icon" />
        <div>{hero.agility}</div>
        <img src="/dice.svg" alt="strength dice" className="label-icon" />
        <div className="icons">
          {Array.from({ length: hero.strengthDice }, (_, i) => (
            <img key={i} src="/dice.svg" alt="dice" className="stat-icon" />
          ))}
        </div>
        <img src="/dice.svg" alt="agility dice" className="label-icon" />
        <div className="icons">
          {Array.from({ length: hero.agilityDice }, (_, i) => (
            <img key={i} src="/dice.svg" alt="dice" className="stat-icon" />
          ))}
        </div>
        <img src="/dice.svg" alt="magic dice" className="label-icon" />
        <div className="icons">
          {Array.from({ length: hero.magicDice }, (_, i) => (
            <img key={i} src="/dice.svg" alt="dice" className="stat-icon" />
          ))}
        </div>
      </div>
      <div className="weapons">
        {hero.weapons.map((w, idx) => (
          <ItemCard key={idx} item={w} />
        ))}
      </div>
    </div>
  )
}

export default HeroPanel
