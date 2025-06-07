import React from 'react'
import { HERO_TYPES } from '../heroData'
import './HeroSelect.css'

function HeroSelect({ onSelect }) {
  return (
    <div className="hero-select">
      <h2>Select Your Hero</h2>
      <div className="hero-options">
        {Object.entries(HERO_TYPES).map(([key, hero]) => (
          <button key={key} onClick={() => onSelect(key)}>
            <img src={hero.image} alt={hero.name} width="40" height="40" />
            <div>{hero.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HeroSelect
