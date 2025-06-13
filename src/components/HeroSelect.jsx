import React, { useState } from 'react'
import { HERO_TYPES } from '../heroData'
import HeroPanel from './HeroPanel'
import ConfirmModal from './ConfirmModal'
import './HeroSelect.scss'

function HeroSelect({ onSelect }) {
  const [confirmHero, setConfirmHero] = useState(null)

  const handleSelect = heroKey => {
    setConfirmHero(heroKey)
  }

  const confirm = () => {
    if (confirmHero) onSelect(confirmHero)
    setConfirmHero(null)
  }

  return (
    <div className="hero-select">
      <h2>Select Your Hero</h2>
      <div className="hero-options">
        {Object.entries(HERO_TYPES).map(([key, hero]) => (
          <div key={key} className="hero-choice">
            <HeroPanel hero={hero} />
            <button className="select-btn" onClick={() => handleSelect(key)}>
              Choose
            </button>
          </div>
        ))}
      </div>
      {confirmHero && (
        <ConfirmModal
          message={`Start game as ${HERO_TYPES[confirmHero].name}?`}
          onConfirm={confirm}
          onCancel={() => setConfirmHero(null)}
        />
      )}
    </div>
  )
}

export default HeroSelect
