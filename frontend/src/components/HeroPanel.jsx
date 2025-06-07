import React from 'react'
import './HeroPanel.css'

function HeroPanel({ hero }) {
  return (
    <div className="hero-panel">
      <h2>Hero Attributes</h2>
      <p>Icon: {hero.icon}</p>
      <p>Position: ({hero.row}, {hero.col})</p>
      <p>Movement: {hero.movement}</p>
    </div>
  )
}

export default HeroPanel
