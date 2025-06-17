import React from 'react'
import './Goblin.scss'

function Goblin({ goblin, damaged }) {
  return <div className={`goblin${damaged ? ' shake' : ''}`}>{goblin.icon}</div>
}

export default Goblin
