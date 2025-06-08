import React from 'react'
import './RoomTile.css'
import { DISARM_RULE } from '../trapRules'

const DIRS = ['up', 'down', 'left', 'right']

function RoomTile({ tile, onClick, highlight }) {
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''} ${
        tile.revealed && tile.trap && !tile.trapResolved ? 'trap-room' : ''
      }`}
      onClick={onClick}
      title={
        tile.revealed
          ? tile.roomId +
            (tile.trap && !tile.trapResolved
              ? ` - ${DISARM_RULE} Need ${tile.trap.difficulty} points.`
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
      {tile.revealed && tile.trap && (
        <span
          className="trap-icon"
          title={
            tile.trapResolved
              ? 'Trap disarmed'
              : `${DISARM_RULE} Need ${tile.trap.difficulty} points.`
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
