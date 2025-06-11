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

  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>Trap!</h2>
        {rolls.length === 0 && (
          <>
            <p className="trap-info">
              {DISARM_RULE} Difficulty {trap.difficulty}.
            </p>
            <div className="buttons">
              <button onClick={attempt}>Disarm</button>
            </div>
          </>
        )}
        {rolls.length > 0 && (
          <div className="fight-stage">
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
