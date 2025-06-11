import React from 'react'
import { HERO_TYPES } from '../heroData'
import './HeroSelect.scss'

function HeroSelect({ onSelect }) {
  return (
    <div className="hero-select">
      <h2>Select Your Hero</h2>
      <div className="hero-options">
        {Object.entries(HERO_TYPES).map(([key, hero]) => (
          <button key={key} onClick={() => onSelect(key)}>
            <img src={hero.image} alt={hero.name} />
            <div>{hero.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HeroSelect
