import React, { useState } from 'react'
import './EncounterModal.css'
import ItemCard from './ItemCard'
import { computeAttackBreakdown, fightGoblin } from '../fightUtils'

function EncounterModal({ goblin, hero, onFight, onFlee }) {
  const [stage, setStage] = useState('menu')
  const [rolls, setRolls] = useState([])
  const [baseIdx, setBaseIdx] = useState(null)
  const [weaponIdx, setWeaponIdx] = useState(0)
  const [result, setResult] = useState(null)

  const startFight = () => {
    const weapon = hero.weapons[weaponIdx]
    const diceKey = `${weapon.dice}Dice`
    const count = hero[diceKey]
    const r = Array.from({ length: count }, () => Math.ceil(Math.random() * 6))
    setRolls(r)
    setStage('fight')
  }

  const startFlee = () => {
    const r = Array.from(
      { length: hero.agilityDice },
      () => Math.ceil(Math.random() * 6),
    )
    setRolls(r)
    setStage('flee')
  }

  const confirmFight = () => {
    const weapon = hero.weapons[weaponIdx]
    const res = fightGoblin(hero, goblin, weapon, rolls, baseIdx)
    setResult({ type: 'fight', ...res })
    setStage('result')
  }

  const confirmFlee = () => {
    const success = rolls.some(v => v >= 4)
    const heroDef = hero.defence + hero.weapons[weaponIdx].defence
    const damage = Math.max(1, goblin.attack - heroDef)
    const message = success
      ? 'You successfully fled.'
      : `Failed to flee and took ${damage} damage.`
    setResult({ type: 'flee', success, message })
    setStage('result')
  }

  const closeResult = () => {
    if (!result) return
    if (result.type === 'fight') {
      onFight(rolls, baseIdx, weaponIdx)
    } else if (result.type === 'flee') {
      onFlee(result.success)
    }
    setRolls([])
    setBaseIdx(null)
    setResult(null)
    setStage('menu')
  }

  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>{goblin.name}</h2>
        <img
          src={goblin.image}
          alt={goblin.name}
          width="100"
          height="100"
          className={
            stage === 'result' &&
            result &&
            result.type === 'fight' &&
            result.heroDmg > 0
              ? 'shake'
              : undefined
          }
        />
        <div className="stats">
          <div className="label">HP</div>
          <div>{goblin.hp}</div>
          <div className="label">STR</div>
          <div>{goblin.attack}</div>
          <div className="label">Def</div>
          <div>{goblin.defence}</div>
        </div>
        {stage === 'menu' && (
          <>
            <div className="weapon-select">
              {hero.weapons.map((w, idx) => (
                <label
                  key={idx}
                  className={`weapon-option ${weaponIdx === idx ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    checked={weaponIdx === idx}
                    onChange={() => setWeaponIdx(idx)}
                  />
                  <ItemCard item={w} />
                </label>
              ))}
            </div>
            <div className="buttons">
              <button onClick={startFight}>Fight</button>
              <button onClick={startFlee}>Flee</button>
            </div>
          </>
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
            <div className="info">
              {baseIdx === null
                ? 'Choose a base die (>=3).'
                : (() => {
                    const details = computeAttackBreakdown(
                      hero,
                      hero.weapons[weaponIdx],
                      rolls,
                      baseIdx
                    )
                    const parts = [`${details.hero} hero`, `${details.weapon} weapon`]
                    if (details.base) parts.push(`${details.base} base`)
                    if (details.extra) parts.push(`${details.extra} extra`)
                    return `Power ${details.total} (${parts.join(' + ')}) vs defence ${goblin.defence}`
                  })()}
            </div>
            <div className="buttons">
              <button onClick={confirmFight} disabled={baseIdx === null}>Attack</button>
            </div>
          </div>
        )}
        {stage === 'flee' && (
          <div className="fight-stage">
            <div className="dice-container">
              {rolls.map((v, idx) => (
                <div key={idx} className="dice">
                  {v}
                </div>
              ))}
            </div>
            <div className="info">Need a 4 or higher on any die to escape.</div>
            <div className="buttons">
              <button onClick={confirmFlee}>Run!</button>
            </div>
          </div>
        )}
        {stage === 'result' && result && (
          <div className="result-stage">
            <div className="result-message">{result.message}</div>
            <div className="buttons">
              <button onClick={closeResult}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EncounterModal
