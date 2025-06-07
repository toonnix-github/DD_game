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
      {!tile.revealed && <span className="room-name">?</span>}
      {tile.revealed && (
        <div className="room-graphic">
          <div className="center" />
          {DIRS.map(dir =>
            tile.paths && tile.paths[dir] ? (
              <div key={dir} className={`door door-${dir}`} />
            ) : null
          )}
        </div>
      )}
      {tile.revealed && tile.goblin && (
        <span className="goblin-icon">{tile.goblin.icon}</span>
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
