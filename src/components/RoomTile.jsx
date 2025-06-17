import React from 'react';
import './RoomTile.scss';
import { DISARM_RULE, EVASION_RULE } from '../trapRules';

const DIRS = ['up', 'down', 'left', 'right'];

function RoomTile({ tile, move, attack, attackDisabled = false, highlight, disabled, onMove, onAttack }) {
  return (
    <div
      className={`tile ${tile.revealed ? 'revealed' : ''} ${highlight ? 'possible' : ''} ${!tile.revealed && disabled ? 'disabled' : ''
        } ${tile.revealed && tile.trap && !tile.trapResolved ? 'trap-room' : ''}`}
      title={
        tile.revealed
          ? tile.roomId +
            (tile.trap && !tile.trapResolved
              ? ` - ${EVASION_RULE} Difficulty ${tile.trap.difficulty}. ${DISARM_RULE}`
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
      {(move || attack) && (
        <div className="action-buttons">
          {move && <button onClick={onMove}>Move</button>}
          {attack && (
            <button onClick={onAttack} disabled={attackDisabled}>
              Attack
            </button>
          )}
        </div>
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
              : `${EVASION_RULE} Difficulty ${tile.trap.difficulty}. ${DISARM_RULE}`
          }
        >
          {tile.trapResolved ? '✅' : tile.trap.icon}
        </span>
      )}
      {tile.revealed && <span className="room-name">{tile.roomId}</span>}
    </div>
  );
}

export default RoomTile;
