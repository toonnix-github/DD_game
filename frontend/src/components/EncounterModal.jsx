import React, { useEffect, useState } from 'react'
import './EncounterModal.scss'
import ItemCard from './ItemCard'
import GoblinCard from './GoblinCard'
import HeroPanel from './HeroPanel'
import {
  computeAttackBreakdown,
  fightGoblin,
  computeUnusedRewards,
  formatFightMessage,
} from '../fightUtils'

function rewardInfo(value) {
  switch (value) {
    case 1:
      return { icon: '/icon/starburst.png', text: '+2' }
    case 2:
      return { icon: '/icon/starburst.png', text: '+3' }
    case 3:
    case 4:
      return { icon: '/icon/starburst.png', text: '+1' }
    case 6:
      return { icon: '/heart.png', text: '+1' }
    default:
      return null
  }
}

function EncounterModal({ goblin, hero, goblinCount, onFight, onFlee, onReward, onSkill }) {
  const [stage, setStage] = useState('menu')
  const [rolls, setRolls] = useState([])
  const [baseIdx, setBaseIdx] = useState(null)
  const [extraIdxs, setExtraIdxs] = useState([])
  const [weaponIdx, setWeaponIdx] = useState(0)
  const [result, setResult] = useState(null)
  const [counterPhase, setCounterPhase] = useState(null)
  const [counterMsg, setCounterMsg] = useState('')
  const [attackPhase, setAttackPhase] = useState(null)
  const [attackMsg, setAttackMsg] = useState('')
  const [shieldDmg, setShieldDmg] = useState(null)
  const [shieldBroken, setShieldBroken] = useState(false)
  const [hpDmg, setHpDmg] = useState(null)
  const [heroHpDmg, setHeroHpDmg] = useState(null)
  const [heroShieldBroken, setHeroShieldBroken] = useState(false)
  const [useSkill, setUseSkill] = useState(false)
  const [shake, setShake] = useState(true)
  const [entered, setEntered] = useState(false)
  const [displayGoblin, setDisplayGoblin] = useState(goblin)
  const [displayHero, setDisplayHero] = useState(hero)

  useEffect(() => {
    setDisplayGoblin(goblin)
  }, [goblin])

  useEffect(() => {
    setDisplayHero(hero)
  }, [hero])

  useEffect(() => {
    const t1 = setTimeout(() => setShake(false), 400)
    const t2 = setTimeout(() => setEntered(true), 20)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (stage !== 'counter' || !result || !result.counter) return
    let t
    if (counterPhase === 'roll') {
      t = setTimeout(() => {
        const label =
          result.counter.roll != null
            ? result.counter.roll
            : result.counter.effect === 'shieldBreak'
            ? 'shield break'
            : 'torch down'
        setCounterPhase('show')
        setCounterMsg(`Rolled ${label}`)
      }, 1000)
    } else if (counterPhase === 'show') {
      t = setTimeout(() => {
        if (result.counter.effect === 'torchDown') {
          setCounterMsg('Torch down!')
        } else {
          const bd = result.counter.breakdown
          const parts = [`${bd.attack} attack`]
          if (bd.roll) parts.push(`${bd.roll} roll`)
          if (bd.extra) parts.push(`${bd.extra} mod`)
          const detail = parts.join(' + ')
          const baseMsg = `Counterattack power ${bd.total} (${detail}) vs defence ${result.counter.defenceBefore}.`
          if (result.counter.effect === 'shieldBreak') {
            setCounterMsg(`${baseMsg} Shield break! You take ${result.counter.damage} damage.`)
          } else if (result.counter.brokeShield) {
            setCounterMsg(`${baseMsg} Shield broken! You take ${result.counter.damage} damage.`)
          } else if (result.counter.damage > 0) {
            setCounterMsg(`${baseMsg} You take ${result.counter.damage} damage.`)
          } else {
            setCounterMsg(`${baseMsg} The shield absorbs the blow.`)
          }
        }
        setCounterPhase('effect')
      }, 1000)
    } else if (counterPhase === 'effect') {
      setHeroHpDmg(result.counter.damage)
      if (result.counter.effect === 'shieldBreak' || result.counter.brokeShield)
        setHeroShieldBroken(true)
      t = setTimeout(() => {
        setDisplayHero(result.hero)
        setHeroHpDmg(null)
        setHeroShieldBroken(false)
        setCounterPhase(null)
        setStage('result')
      }, 1500)
    }
    return () => clearTimeout(t)
  }, [stage, counterPhase, result])

  useEffect(() => {
    if (stage !== 'attack' || !result) return
    let t1
    let t2
    if (attackPhase === 'swing') {
      t1 = setTimeout(() => {
        setAttackPhase('shieldHit')
        setAttackMsg("The goblin's shield shakes!")
        setShieldDmg(result.shieldDamage)
      }, 1000)
    } else if (attackPhase === 'shieldHit') {
      t1 = setTimeout(() => {
        setShieldDmg(null)
        setDisplayGoblin(g => ({
          ...g,
          defence: Math.max(0, g.defence - result.shieldDamage),
        }))
        if (result.brokeShield) {
          setShieldBroken(true)
          setAttackMsg('The shield shatters!')
          t2 = setTimeout(() => {
            setShieldBroken(false)
            setAttackPhase(result.heroDmg > 0 ? 'hpHit' : 'finish')
          }, 600)
        } else {
          setAttackMsg('The blow fails to break the shield.')
          setAttackPhase('finish')
        }
      }, 1000)
    } else if (attackPhase === 'hpHit') {
      t1 = setTimeout(() => {
        setHpDmg(result.heroDmg)
        t2 = setTimeout(() => {
          setDisplayGoblin(g => ({ ...g, hp: result.goblin.hp }))
          setHpDmg(null)
          setAttackPhase('finish')
        }, 600)
      }, 1000)
    } else if (attackPhase === 'finish') {
      t1 = setTimeout(() => {
        if (result.counter) {
          setCounterPhase('roll')
          setCounterMsg('Goblin rolls for counterattack...')
          setStage('counter')
        } else {
          setStage('result')
        }
      }, 1000)
    }
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [stage, attackPhase, result])

  const startFight = () => {
    const weapon = hero.weapons[weaponIdx]
    const diceKey = `${weapon.dice}Dice`
    const count = hero[diceKey]
    const r = Array.from({ length: count }, () => Math.ceil(Math.random() * 6))
    if (useSkill && hero.skill && hero.skill.cost && onSkill) {
      onSkill(hero.skill.cost, hero.skill.title)
    }
    setRolls(r)
    setBaseIdx(null)
    setExtraIdxs([])
    setStage('fight')
  }

  const startFlee = () => {
    const r = Array.from(
      { length: hero.agilityDice },
      () => Math.ceil(Math.random() * 6),
    )
    setRolls(r)
    setBaseIdx(null)
    setExtraIdxs([])
    setStage('flee')
  }

  const confirmFight = () => {
    const weapon = hero.weapons[weaponIdx]
    const rewards = computeUnusedRewards(rolls, baseIdx, extraIdxs)
    if (onReward) {
      onReward(rewards)
    }
    const heroWithRewards = {
      ...hero,
      ap: Math.min(hero.ap + rewards.ap, hero.maxAp),
      hp: Math.min(hero.hp + rewards.hp, hero.maxHp),
    }
    const bonus = useSkill && hero.skill && hero.skill.bonus ? hero.skill.bonus : 0
    const res = fightGoblin(
      heroWithRewards,
      goblin,
      weapon,
      rolls,
      baseIdx,
      extraIdxs,
      bonus,
      goblinCount,
    )
    const resultObj = {
      type: 'fight',
      ...res,
      rewards,
      skillUsed: useSkill,
      weaponIdx,
      rolls,
      baseIdx,
      extraIdxs,
    }
    const parts = []
    if (rewards.ap) parts.push(`${rewards.ap} ap`)
    if (rewards.hp) parts.push(`${rewards.hp} hp`)
    let msg = formatFightMessage(resultObj)
    if (parts.length) {
      msg += ` Unused dice reward: ${parts.join(' and ')}.`
    }
    resultObj.message = msg
    setResult(resultObj)
    setDisplayHero(heroWithRewards)
    setDisplayGoblin(goblin)
    setAttackPhase('swing')
    setAttackMsg(`You swing your ${weapon.name}...`)
    setStage('attack')
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
      onFight({ ...result, weaponIdx, rolls, baseIdx, extraIdxs })
    } else if (result.type === 'flee') {
      onFlee(result.success)
    }
    setRolls([])
    setBaseIdx(null)
    setExtraIdxs([])
    setResult(null)
    setAttackPhase(null)
    setAttackMsg('')
    setShieldDmg(null)
    setShieldBroken(false)
    setDisplayGoblin(goblin)
    setDisplayHero(hero)
    setUseSkill(false)
    setStage('menu')
  }

  return (
    <div className={`encounter-overlay${shake ? ' screen-shake' : ''}`}>
      <div className="encounter-window">
        <div className={`encounter-side goblin-side${entered ? ' enter-left' : ''}`}>
          <GoblinCard
            goblin={
              stage === 'attack'
                ? displayGoblin
                : result && result.goblin
                ? { ...result.goblin, defence: result.defenceAfter }
                : goblin
            }
            damaged={
              stage === 'attack' &&
              attackPhase === 'hpHit' &&
              result &&
              result.type === 'fight' &&
              result.heroDmg > 0
            }
            defeated={
              stage === 'result' &&
              result &&
              result.type === 'fight' &&
              result.goblin.hp <= 0
            }
            shieldDamage={stage === 'attack' ? shieldDmg : null}
            shieldBroken={stage === 'attack' && shieldBroken}
            hpDamage={stage === 'attack' ? hpDmg : null}
          />
        </div>

        <div className="encounter-middle">
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
              {hero.skill && hero.skill.title && (
                <label className="use-skill-option">
                  <input
                    type="checkbox"
                    checked={useSkill}
                    onChange={e => setUseSkill(e.target.checked)}
                    disabled={hero.ap < (hero.skill.cost || 0)}
                  />
                  Use {hero.skill.title} (-{hero.skill.cost} AP)
                </label>
              )}
              <div className="buttons">
                <button onClick={startFight}>Fight</button>
                <button onClick={startFlee}>Flee</button>
              </div>
            </>
          )}
          {stage === 'fight' && (
            <div className="fight-stage">
              <div className="dice-container">
                {rolls.map((v, idx) => {
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
                        prev.includes(idx)
                          ? prev.filter(i => i !== idx)
                          : [...prev, idx],
                      )
                    }
                  }
                  const reward = rewardInfo(v)
                  return (
                    <div key={idx} className={classes.join(' ')} onClick={handleClick}>
                      <div className="dice-value">
                        {v < 3 && <img src="/add-icon.png" alt="+" className="plus-icon" />}
                        {v}
                      </div>
                      {reward && (
                        <div className="dice-reward">
                          <img src={reward.icon} alt="reward" />
                          <span>{reward.text}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="info">
                {baseIdx === null
                  ? rolls.some(v => v >= 3)
                    ? 'Choose a base die (>=3).'
                    : 'No die is high enough for a base roll.'
                  : (() => {
                      const details = computeAttackBreakdown(
                        hero,
                        hero.weapons[weaponIdx],
                        rolls,
                        baseIdx,
                        extraIdxs,
                        useSkill && hero.skill && hero.skill.bonus ? hero.skill.bonus : 0
                      )
                      const parts = [`${details.weapon} weapon`]
                      if (details.hero > 0) parts.unshift(`${details.hero} hero`)
                      if (details.base) parts.push(`${details.base} base`)
                      if (details.extra) parts.push(`${details.extra} extra`)
                      return `Power ${details.total} (${parts.join(' + ')}) vs defence ${goblin.defence}`
                    })()}
              </div>
              <div className="buttons">
                <button
                  onClick={confirmFight}
                  disabled={rolls.some(v => v >= 3) && baseIdx === null}
                >
                  Attack
                </button>
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
          {stage === 'attack' && result && (
            <div className="result-stage">
              <div className="result-message">{attackMsg}</div>
            </div>
          )}
          {stage === 'counter' && result && (
            <div className="result-stage">
              <div className="result-message">{counterMsg}</div>
              <div className="dice-container">
                <div
                  className={`monster-dice${
                    counterPhase === 'roll' ? ' dice-shake' : ''
                  }`}
                >
                  {counterPhase === 'roll'
                    ? ''
                    : result.counter.effect === 'shieldBreak'
                    ? (
                        <img src="/shield.png" alt="shield break" />
                      )
                    : result.counter.effect === 'torchDown'
                    ? (
                        <span className="torch-icon">🔥</span>
                      )
                    : (
                        result.counter.roll
                      )}
                </div>
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

        <div className={`encounter-side hero-side${entered ? ' enter-right' : ''}`}>
          <HeroPanel
            hero={displayHero}
            hpDamage={heroHpDmg}
            shieldBroken={heroShieldBroken}
          />
          <div className="hero-items">
            {hero.weapons.map((w, idx) => (
              <ItemCard key={idx} item={w} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EncounterModal

