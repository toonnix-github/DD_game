import React from 'react'
import './Hero.scss'

function Hero({ hero, damaged }) {
  return <div className={`hero${damaged ? ' shake' : ''}`}>{hero.icon}</div>
}

export default Hero
