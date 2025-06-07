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
        <div className="label">Move</div>
        <div className="icons">
          {Array.from({ length: hero.movement }, (_, i) => (
            <img key={i} src="/boot.svg" alt="move" className="stat-icon" />
          ))}
        </div>
        <div className="label">HP</div>
        <div className="icons">
          {Array.from({ length: hero.hp }, (_, i) => (
            <img key={i} src="/heart.svg" alt="hp" className="stat-icon" />
          ))}
        </div>
        <div className="label">AP</div>
        <div className="icons">
          {Array.from({ length: hero.ap }, (_, i) => (
            <img key={i} src="/star.svg" alt="ap" className="stat-icon" />
          ))}
        </div>
        <div className="label">STR</div>
        <div className="icons">
          {Array.from({ length: hero.attack }, (_, i) => (
            <img key={i} src="/fist.svg" alt="strength" className="stat-icon" />
          ))}
        </div>
        <div className="label">Def</div>
        <div className="icons">
          {Array.from({ length: hero.defence }, (_, i) => (
            <img key={i} src="/shield.svg" alt="defence" className="stat-icon" />
          ))}
        </div>
        <div className="label">Agi</div>
        <div className="icons">
          {Array.from({ length: hero.agility }, (_, i) => (
            <img key={i} src="/wing.svg" alt="agility" className="stat-icon" />
          ))}
        </div>
        <div className="label">STR Dice</div>
        <div className="icons">
          {Array.from({ length: hero.strengthDice }, (_, i) => (
            <img key={i} src="/dice.svg" alt="dice" className="stat-icon" />
          ))}
        </div>
        <div className="label">Agi Dice</div>
        <div className="icons">
          {Array.from({ length: hero.agilityDice }, (_, i) => (
            <img key={i} src="/dice.svg" alt="dice" className="stat-icon" />
          ))}
        </div>
        <div className="label">Magic Dice</div>
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
