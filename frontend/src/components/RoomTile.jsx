import React from 'react'
import Hero from './Hero'
import './RoomTile.css'

const DIRS = ['up', 'down', 'left', 'right']

function RoomTile({ tile, hero, onClick, highlight }) {
  const heroHere = hero && hero.row === tile.row && hero.col === tile.col
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''}`}
      onClick={onClick}
      title={tile.revealed ? tile.roomId : undefined}
    >
      <span className="room-name">{tile.revealed ? tile.roomId : '?'}</span>
      {tile.revealed && (
        <div className="paths">
          {DIRS.filter(d => tile.paths && tile.paths[d])
            .map(d => d[0].toUpperCase())
            .join('')}
        </div>
      )}
      {heroHere && (
        <div className="hero-wrapper">
          <Hero hero={hero} />
        </div>
      )}
    </div>
  )
}

export default RoomTile
