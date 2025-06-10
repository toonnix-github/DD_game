import React from 'react'
import './RoomTile.css'
import { DISARM_RULE } from '../trapRules'

const DIRS = ['up', 'down', 'left', 'right']

function RoomTile({ tile, onClick, highlight, disabled }) {
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''} ${
        disabled ? 'disabled' : ''
      } ${tile.revealed && tile.trap && !tile.trapResolved ? 'trap-room' : ''}`}
      onClick={onClick}
      title={
        tile.revealed
          ? tile.roomId +
            (tile.trap && !tile.trapResolved
              ? ` - ${DISARM_RULE} Difficulty ${tile.trap.difficulty}.`
              : '')
          : undefined
      }
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
      {tile.revealed && tile.effect === 'death' && (
        <img src="/star.svg" alt="defeated" className="death-effect" />
      )}
      {tile.revealed && tile.trap && (
        <span
          className="trap-icon"
          title={
            tile.trapResolved
              ? 'Trap disarmed'
              : `${DISARM_RULE} Difficulty ${tile.trap.difficulty}.`
          }
        >
          {tile.trapResolved ? '✅' : tile.trap.icon}
        </span>
      )}
      {tile.revealed && <span className="room-name">{tile.roomId}</span>}
    </div>
  )
}

export default RoomTile
