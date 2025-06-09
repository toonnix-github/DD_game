import React from 'react'
import './HeroPanel.css'
import ItemCard from './ItemCard'

function HeroPanel({ hero, damaged }) {
  return (
    <div className="hero-panel">
      <div className="hero-card">
        <div className="card-title">{hero.name}</div>
        <img
          src={hero.image}
          alt={hero.name}
          width="100"
          height="100"
          className={damaged ? 'hero-image shake' : 'hero-image'}
        />
        <div className="stats">
          <div className="label">Move</div>
          <div className="value">{hero.movement}</div>
          <div className="label">HP</div>
          <div className="value">{hero.hp}</div>
          <div className="label">AP</div>
          <div className="value">{hero.ap}</div>
          <div className="label">STR</div>
          <div className="value">{hero.attack}</div>
          <div className="label">Def</div>
          <div className="value">{hero.defence}</div>
          <div className="label">Agi</div>
          <div className="value">{hero.agility}</div>
          <div className="label">STR Dice</div>
          <div className="value">{hero.strengthDice}</div>
          <div className="label">Agi Dice</div>
          <div className="value">{hero.agilityDice}</div>
          <div className="label">Magic Dice</div>
          <div className="value">{hero.magicDice}</div>
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
