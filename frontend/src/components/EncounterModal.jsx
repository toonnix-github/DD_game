import React, { useState } from 'react'
import './EncounterModal.css'

function EncounterModal({ goblin, hero, onFight, onFlee }) {
  const [stage, setStage] = useState('menu')
  const [rolls, setRolls] = useState([])
  const [baseIdx, setBaseIdx] = useState(null)

  const startFight = () => {
    const r = Array.from({ length: hero.fightDice }, () => Math.ceil(Math.random() * 6))
    setRolls(r)
    setStage('fight')
  }

  const confirmFight = () => {
    onFight(rolls, baseIdx)
    setStage('menu')
    setRolls([])
    setBaseIdx(null)
  }

  const handleFlee = () => {
    const r = Array.from({ length: hero.fleeDice }, () => Math.ceil(Math.random() * 6))
    const success = r.some(v => v >= 4)
    onFlee(success)
  }

  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>{goblin.name}</h2>
        <img src={goblin.image} alt={goblin.name} width="100" height="100" />
        <div className="stats">
          <div className="label">HP</div>
          <div>{goblin.hp}</div>
          <div className="label">Atk</div>
          <div>{goblin.attack}</div>
          <div className="label">Def</div>
          <div>{goblin.defence}</div>
        </div>
        {stage === 'menu' && (
          <div className="buttons">
            <button onClick={startFight}>Fight</button>
            <button onClick={handleFlee}>Flee</button>
          </div>
        )}
        {stage === 'fight' && (
          <div className="fight-stage">
            <div className="dice-container">
              {rolls.map((v, idx) => (
                <div
                  key={idx}
                  className={`dice ${idx === baseIdx ? 'base' : ''} ${v >= 3 ? 'selectable' : ''}`}
                  onClick={() => {
                    if (v >= 3) setBaseIdx(idx)
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
            <div className="buttons">
              <button onClick={confirmFight} disabled={baseIdx === null}>Attack</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EncounterModal
