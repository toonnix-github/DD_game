import React from 'react'
import './RoomTile.css'

const DIRS = ['up', 'down', 'left', 'right']

function RoomTile({ tile, onClick, highlight }) {
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''}`}
      onClick={onClick}
      title={tile.revealed ? tile.roomId : undefined}
    >
      {!tile.revealed && <div className="card-back" />}
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
      {tile.revealed && <span className="room-name">{tile.roomId}</span>}
    </div>
  )
}

export default RoomTile
