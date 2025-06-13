import React, { useState } from 'react'
import './EncounterModal.scss'
import { DISARM_RULE, EVASION_RULE } from '../trapRules'
import { computeAttackBreakdown, computeUnusedRewards } from '../fightUtils'
import HeroPanel from './HeroPanel'

function TrapModal({ hero, trap, onResolve }) {
  const [stage, setStage] = useState('evasionReady')
  const [evasionRolls, setEvasionRolls] = useState([])
  const [evaded, setEvaded] = useState(null)
  const [disarmRolls, setDisarmRolls] = useState([])
  const [baseIdx, setBaseIdx] = useState(null)
  const [extraIdxs, setExtraIdxs] = useState([])
  const [disarmSuccess, setDisarmSuccess] = useState(null)
  const [rewards, setRewards] = useState(null)
  const [evasionRewards, setEvasionRewards] = useState(null)

  const roll = () =>
    Array.from({ length: hero.agilityDice }, () => Math.ceil(Math.random() * 6))

  const startEvasion = () => {
    setStage('evasionRoll')
    setTimeout(() => {
      const r = roll()
      setEvasionRolls(r)
      setBaseIdx(null)
      setExtraIdxs([])
      setStage('evasionSelect')
    }, 600)
  }

  const startDisarm = () => {
    setStage('disarmRoll')
    setTimeout(() => {
      const r = roll()
      setDisarmRolls(r)
      setBaseIdx(null)
      setExtraIdxs([])
      setStage('disarmSelect')
    }, 600)
  }

  const confirmEvasion = () => {
    const details = computeAttackBreakdown(
      {},
      { attack: 0 },
      evasionRolls,
      baseIdx,
      extraIdxs,
    )
    const success = details.total >= trap.difficulty
    setEvaded(success)
    setEvasionRewards(
      success ? computeUnusedRewards(evasionRolls, baseIdx, extraIdxs) : { ap: 0, hp: 0 },
    )
    setStage('postEvasion')
  }

  const confirmDisarm = () => {
    const details = computeAttackBreakdown(
      {},
      { attack: 0 },
      disarmRolls,
      baseIdx,
      extraIdxs,
    )
    const success = details.total >= trap.difficulty
    setRewards(success ? computeUnusedRewards(disarmRolls, baseIdx, extraIdxs) : { ap: 0, hp: 0 })
    setDisarmSuccess(success)
    setStage('done')
  }

  const skip = () =>
    onResolve({
      evaded,
      evasionRewards,
      disarm: undefined,
      evasionRolls,
      disarmRolls: [],
    })

  const close = () => {
    if (disarmSuccess !== null) {
      onResolve({
        evaded,
        evasionRewards,
        disarm: disarmSuccess,
        evasionRolls,
        disarmRolls,
        baseIdx,
        extraIdxs,
        rewards,
      })
    }
  }

  const trapName = trap.id
    ? trap.id.charAt(0).toUpperCase() + trap.id.slice(1)
    : ''

  return (
    <div className="encounter-overlay">
      <div className="encounter-window trap-window">
        <div className="encounter-middle">
          <div className="trap-header">
            <span className="trap-icon">{trap.icon}</span>
            <span className="trap-name">{trapName}</span>
          </div>
        {stage === 'evasionReady' && (
          <>
            <p className="trap-info">{EVASION_RULE}</p>
            <p className="trap-difficulty">Need {trap.difficulty}+ on the highest die.</p>
            <div className="dice-container">
              {Array.from({ length: hero.agilityDice }).map((_, idx) => (
                <div key={idx} className="hero-dice" />
              ))}
            </div>
            <div className="buttons">
              <button onClick={startEvasion}>Roll</button>
            </div>
          </>
        )}
        {stage === 'evasionRoll' && (
          <div className="trap-result">
            <div className="dice-container">
              {Array.from({ length: hero.agilityDice }).map((_, idx) => (
                <div key={idx} className="hero-dice dice-shake" />
              ))}
            </div>
          </div>
        )}
        {stage === 'evasionSelect' && (
          <div className="trap-result">
            <div className="dice-container">
              {evasionRolls.map((v, idx) => {
                const isBase = idx === baseIdx
                const isExtra = extraIdxs.includes(idx)
                const classes = ['dice']
                if (isBase) classes.push('base')
                if (v >= 3) {
                  classes.push('selectable')
                } else {
                  classes.push(baseIdx === null ? 'disabled' : 'selectable')
                  if (isExtra) classes.push('extra')
                }
                const handleClick = () => {
                  if (v >= 3) {
                    setBaseIdx(idx)
                    setExtraIdxs([])
                  } else if (baseIdx !== null) {
                    setExtraIdxs(prev =>
                      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx],
                    )
                  }
                }
                return (
                  <div key={idx} className={classes.join(' ')} onClick={handleClick}>
                    <div className="dice-value">
                      {v < 3 && <img src="/add-icon.png" alt="+" className="plus-icon" />}
                      {v}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="info">
              {baseIdx === null
                ? evasionRolls.some(v => v >= 3)
                  ? 'Choose a base die (>=3).'
                  : 'No die is high enough for a base roll.'
                : (() => {
                    const details = computeAttackBreakdown(
                      {},
                      { attack: 0 },
                      evasionRolls,
                      baseIdx,
                      extraIdxs,
                    )
                    const r = computeUnusedRewards(evasionRolls, baseIdx, extraIdxs)
                    const parts = []
                    if (details.base) parts.push(`${details.base} base`)
                    if (details.extra) parts.push(`${details.extra} extra`)
                    const rewardParts = []
                    if (r.ap) rewardParts.push(`${r.ap} ap`)
                    if (r.hp) rewardParts.push(`${r.hp} hp`)
                    return (
                      <>
                        {`Need ${trap.difficulty}, power ${details.total} (${parts.join(' + ')})`}
                        {rewardParts.length ? (
                          <>
                            <br />Unused dice reward: {rewardParts.join(' and ')}
                          </>
                        ) : null}
                      </>
                    )
                  })()}
            </div>
            <div className="buttons">
              <button onClick={confirmEvasion} disabled={evasionRolls.some(v => v >= 3) && baseIdx === null}>
                Confirm
              </button>
            </div>
          </div>
        )}
        {stage === 'postEvasion' && (
          <div className="trap-result">
            <div className="dice-container">
              {evasionRolls.map((v, idx) => (
                <div key={idx} className="hero-dice">{v}</div>
              ))}
            </div>
            <div className="info">
              {evaded ? 'Evaded the trap!' : `Took ${trap.damage} damage!`}
              {evaded && evasionRewards && (evasionRewards.ap || evasionRewards.hp) ? (
                <>
                  <br />Reward: {evasionRewards.ap ? `${evasionRewards.ap} ap` : ''}
                  {evasionRewards.ap && evasionRewards.hp ? ' and ' : ''}
                  {evasionRewards.hp ? `${evasionRewards.hp} hp` : ''}
                </>
              ) : null}
            </div>
            <div className="buttons">
              {hero.ap > 0 && <button onClick={() => setStage('disarmReady')}>Disarm (1 AP)</button>}
              <button onClick={skip}>Continue</button>
            </div>
          </div>
        )}
        {stage === 'disarmReady' && (
          <div className="trap-result">
            <div className="dice-container">
              {Array.from({ length: hero.agilityDice }).map((_, idx) => (
                <div key={idx} className="hero-dice" />
              ))}
            </div>
            <div className="info">{DISARM_RULE}</div>
            <div className="buttons">
              <button onClick={startDisarm}>Roll</button>
              <button onClick={skip}>Cancel</button>
            </div>
          </div>
        )}
        {stage === 'disarmRoll' && (
          <div className="trap-result">
            <div className="dice-container">
              {Array.from({ length: hero.agilityDice }).map((_, idx) => (
                <div key={idx} className="hero-dice dice-shake" />
              ))}
            </div>
          </div>
        )}
        {stage === 'disarmSelect' && (
          <div className="trap-result">
            <div className="dice-container">
              {disarmRolls.map((v, idx) => {
                const isBase = idx === baseIdx
                const isExtra = extraIdxs.includes(idx)
                const classes = ['dice']
                if (isBase) classes.push('base')
                if (v >= 3) {
                  classes.push('selectable')
                } else {
                  classes.push(baseIdx === null ? 'disabled' : 'selectable')
                  if (isExtra) classes.push('extra')
                }
                const handleClick = () => {
                  if (v >= 3) {
                    setBaseIdx(idx)
                    setExtraIdxs([])
                  } else if (baseIdx !== null) {
                    setExtraIdxs(prev =>
                      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx],
                    )
                  }
                }
                return (
                  <div key={idx} className={classes.join(' ')} onClick={handleClick}>
                    <div className="dice-value">
                      {v < 3 && <img src="/add-icon.png" alt="+" className="plus-icon" />}
                      {v}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="info">
              {baseIdx === null
                ? disarmRolls.some(v => v >= 3)
                  ? 'Choose a base die (>=3).'
                  : 'No die is high enough for a base roll.'
                : (() => {
                    const details = computeAttackBreakdown(
                      {},
                      { attack: 0 },
                      disarmRolls,
                      baseIdx,
                      extraIdxs,
                    )
                    const r = computeUnusedRewards(disarmRolls, baseIdx, extraIdxs)
                    const parts = []
                    if (details.base) parts.push(`${details.base} base`)
                    if (details.extra) parts.push(`${details.extra} extra`)
                    const rewardParts = []
                    if (r.ap) rewardParts.push(`${r.ap} ap`)
                    if (r.hp) rewardParts.push(`${r.hp} hp`)
                    return (
                      <>
                        {`Need ${trap.difficulty}, power ${details.total} (${parts.join(' + ')})`}
                        {rewardParts.length ? (
                          <>
                            <br />Unused dice reward: {rewardParts.join(' and ')}
                          </>
                        ) : null}
                      </>
                    )
                  })()}
            </div>
            <div className="buttons">
              <button onClick={confirmDisarm} disabled={disarmRolls.some(v => v >= 3) && baseIdx === null}>
                Disarm
              </button>
            </div>
          </div>
        )}
        {stage === 'done' && (
          <div className="trap-result">
            <div className="dice-container">
              {disarmRolls.map((v, idx) => (
                <div key={idx} className="hero-dice">{v}</div>
              ))}
            </div>
            <div className="info">
              {disarmSuccess ? 'Successfully disarmed!' : 'Failed to disarm.'}
              {disarmSuccess && rewards && (rewards.ap || rewards.hp) ? (
                <>
                  <br />Reward: {rewards.ap ? `${rewards.ap} ap` : ''}
                  {rewards.ap && rewards.hp ? ' and ' : ''}
                  {rewards.hp ? `${rewards.hp} hp` : ''}
                </>
              ) : null}
            </div>
            <div className="buttons">
              <button onClick={close}>OK</button>
            </div>
          </div>
        )}
        </div>
        <div className="encounter-side hero-side">
          <HeroPanel hero={hero} />
        </div>
      </div>
    </div>
  )
}

export default TrapModal
