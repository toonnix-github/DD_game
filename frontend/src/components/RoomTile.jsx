import React from 'react'
import Hero from './Hero'
import './RoomTile.css'

function RoomTile({ tile, hero, onClick, highlight }) {
  const heroHere = hero && hero.row === tile.row && hero.col === tile.col
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''}`}
      onClick={onClick}
    >
      {tile.revealed ? tile.roomId : '?'}
      {heroHere && (
        <div className="hero-wrapper">
          <Hero hero={hero} />
        </div>
      )}
    </div>
  )
}

export default RoomTile
