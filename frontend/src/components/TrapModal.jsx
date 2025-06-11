import React, { useState } from 'react'
import './EncounterModal.scss'
import { DISARM_RULE, EVASION_RULE } from '../trapRules'

function TrapModal({ hero, trap, onResolve }) {
  const [stage, setStage] = useState('evasion')
  const [evasionRolls, setEvasionRolls] = useState([])
  const [evaded, setEvaded] = useState(null)
  const [disarmRolls, setDisarmRolls] = useState([])
  const [disarmSuccess, setDisarmSuccess] = useState(null)

  const roll = () => Array.from({ length: hero.agilityDice }, () => Math.ceil(Math.random() * 6))

  const attemptEvasion = () => {
    const r = roll()
    setEvasionRolls(r)
    setEvaded(Math.max(...r) >= trap.difficulty)
    setStage('postEvasion')
  }

  const attemptDisarm = () => {
    const r = roll()
    setDisarmRolls(r)
    setDisarmSuccess(Math.max(...r) >= trap.difficulty)
    setStage('done')
  }

  const skip = () => onResolve({ evaded, disarm: undefined, evasionRolls, disarmRolls: [] })

  const close = () => {
    if (disarmSuccess !== null) {
      onResolve({ evaded, disarm: disarmSuccess, evasionRolls, disarmRolls })
    }
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
        {stage === 'evasion' && (
          <>
            <p className="trap-info">{EVASION_RULE}</p>
            <p className="trap-difficulty">Need {trap.difficulty}+ on the highest die.</p>
            <div className="buttons">
              <button onClick={attemptEvasion}>Evade</button>
            </div>
          </>
        )}
        {stage === 'postEvasion' && (
          <div className="trap-result">
            <div className="dice-container">
              {evasionRolls.map((v, idx) => (
                <div key={idx} className="dice">{v}</div>
              ))}
            </div>
            <div className="info">
              {evaded ? 'Evaded the trap!' : `Took ${trap.damage} damage!`}
            </div>
            <div className="buttons">
              {hero.ap > 0 && <button onClick={attemptDisarm}>Disarm (1 AP)</button>}
              <button onClick={skip}>Continue</button>
            </div>
          </div>
        )}
        {stage === 'done' && (
          <div className="trap-result">
            <div className="dice-container">
              {disarmRolls.map((v, idx) => (
                <div key={idx} className="dice">{v}</div>
              ))}
            </div>
            <div className="info">
              {disarmSuccess ? 'Successfully disarmed!' : 'Failed to disarm.'}
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
