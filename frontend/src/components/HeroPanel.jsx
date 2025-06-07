import React from 'react'
import './HeroPanel.css'

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
        <div className="label">Icon</div>
        <div>{hero.icon}</div>
        <div className="label">Move</div>
        <div>{hero.movement}</div>
        <div className="label">HP</div>
        <div>{hero.hp}</div>
        <div className="label">AP</div>
        <div>{hero.ap}</div>
        <div className="label">Atk</div>
        <div>{hero.attack}</div>
        <div className="label">Def</div>
        <div>{hero.defence}</div>
        <div className="label">Agi</div>
        <div>{hero.agility}</div>
      </div>
    </div>
  )
}

export default HeroPanel
