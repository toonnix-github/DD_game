import React from 'react'
import './Hero.css'

function Hero({ hero }) {
  return <div className="hero">{hero.icon}</div>
}

export default Hero
