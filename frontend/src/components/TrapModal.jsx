import React, { useState } from 'react'
import './EncounterModal.scss'
import { DISARM_RULE } from '../trapRules'

function TrapModal({ hero, trap, onResolve }) {
  const [rolls, setRolls] = useState([])
  const [success, setSuccess] = useState(null)

  const attempt = () => {
    const r = Array.from({ length: hero.agilityDice }, () => Math.ceil(Math.random() * 6))
    setRolls(r)
    const best = Math.max(...r)
    setSuccess(best >= trap.difficulty)
  }

  const close = () => {
    if (success !== null) onResolve({ success, rolls })
  }

  const trapName = trap.id
    ? trap.id.charAt(0).toUpperCase() + trap.id.slice(1)
    : ''

  return (
    <div className="encounter-overlay">
      <div className="encounter-window trap-window">
        <div className="trap-header">
          <span className="trap-icon">{trap.icon}</span>
          <span className="trap-name">{trapName}</span>
        </div>
        {rolls.length === 0 && (
          <>
            <p className="trap-info">{DISARM_RULE}</p>
            <p className="trap-difficulty">Need {trap.difficulty}+ on the highest die.</p>
            <div className="buttons">
              <button onClick={attempt}>Disarm</button>
            </div>
          </>
        )}
        {rolls.length > 0 && (
          <div className="trap-result">
            <div className="dice-container">
              {rolls.map((v, idx) => (
                <div key={idx} className="dice">{v}</div>
              ))}
            </div>
            <div className="info">
              {success ? 'Successfully disarmed!' : 'Failed to disarm.'}
            </div>
            <div className="buttons">
              <button onClick={close}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrapModal
