import React from 'react'
import EventLog from './EventLog'
import './DeveloperModal.scss'

function DeveloperModal({ log, onReset, onClose }) {
  return (
    <div className="dev-overlay">
      <div className="dev-modal">
        <button className="close-dev" onClick={onClose}>&times;</button>
        <EventLog log={log} />
        <button onClick={onReset} className="reset-game dev">Reset Game</button>
      </div>
    </div>
  )
}

export default DeveloperModal
