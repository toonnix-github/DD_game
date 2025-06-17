import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import RoomTile from './components/RoomTile'
import TorchMat from './components/TorchMat'
import ConfirmModal from './components/ConfirmModal'
import Hero from './components/Hero'
import HeroPanel from './components/HeroPanel'
import ItemCard from './components/ItemCard'
import HeroSelect from './components/HeroSelect'
import EncounterModal from './components/EncounterModal'
import TrapModal from './components/TrapModal'
import { TRAP_TYPES } from './trapRules'
import DiscardModal from './components/DiscardModal'
import RewardModal from './components/RewardModal'
import DeveloperModal from './components/DeveloperModal'
import GameOverModal from './components/GameOverModal'
import EventLog from './components/EventLog'
import './App.css'
import { HERO_TYPES } from './heroData'
import { GOBLIN_TYPES, randomGoblinType } from './goblinData'
import GoblinCard from './components/GoblinCard'
import GoblinToken from './components/GoblinToken'
import {
  getRangedTargets,
  getMagicTargets,
  opposite,
  distanceToTarget,
  distanceMagic,
} from './boardUtils'
import {
  BOARD_SIZE,
  CENTER,
  directionFromDelta,
  loadState,
} from './gameSetup'
import useEncounterHandlers from './hooks/useEncounterHandlers'

function App() {
  const [state, setState] = useState(loadState)
  const [heroDamaged, setHeroDamaged] = useState(false)
  const [eventLog, setEventLog] = useState([])
  const [showDevModal, setShowDevModal] = useState(false)
  const [actionPrompt, setActionPrompt] = useState(null)
  const [revealGoblin, setRevealGoblin] = useState(null)
  const [revealPhase, setRevealPhase] = useState('spin')
  const prevHpRef = useRef(state.hero ? state.hero.hp : null)

  const addLog = useCallback(msg => {
    setEventLog(prev => [...prev, msg])
  }, [])

  const chooseHero = useCallback(
    type => {
      const base = HERO_TYPES[type]
      const skill = base.skill
      const skill2 = base.skill2
      const quote = base.quote
    const hero = {
      row: CENTER,
      col: CENTER,
      name: base.name,
      skill: typeof skill === 'object' ? { ...skill } : skill,
      skill2: skill2 ? { ...skill2 } : null,
      movement: base.movement,
      icon: base.icon,
      hp: base.hp,
      maxHp: base.maxHp ?? base.hp,
      ap: base.ap,
      maxAp: base.maxAp ?? base.ap,
      heroAction: base.heroAction ?? 1,
      maxHeroAction: base.maxHeroAction ?? 1,
      defence: base.defence,
      strengthDice: base.strengthDice,
      agilityDice: base.agilityDice,
      magicDice: base.magicDice,
      weapons: base.weapons.map(w => ({ ...w })),
      image: base.image,
      quote,
      type,
      offset: {
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
      },
    }
    setState(prev => ({ ...prev, hero }))
    addLog(`*${hero.name} steps into the dungeon, torch held high.*`)
  }, [addLog])

  useEffect(() => {
    localStorage.setItem('dungeon-state', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!state.hero) return
    if (prevHpRef.current != null && state.hero.hp < prevHpRef.current) {
      setHeroDamaged(true)
      const t = setTimeout(() => setHeroDamaged(false), 300)
      prevHpRef.current = state.hero.hp
      return () => clearTimeout(t)
    }
    prevHpRef.current = state.hero.hp
  }, [state.hero])

  useEffect(() => {
    if (!revealGoblin) return
    setRevealPhase('spin')
    const t1 = setTimeout(() => setRevealPhase('move'), 800)
    const t2 = setTimeout(() => {
      setState(prev => ({
        ...prev,
        discoveredGoblins: [
          ...prev.discoveredGoblins,
          { row: revealGoblin.row, col: revealGoblin.col },
        ],
      }))
      setRevealGoblin(null)
    }, 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [revealGoblin, setState])

  const endTurn = useCallback(() => {
    if (!state.hero) return
    const base = HERO_TYPES[state.hero.type]
    const newTorch = Math.min(state.torch + 1, 20)
    const gameOver = state.gameOver || newTorch >= 20
    setState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        movement: base.movement,
        ap: prev.hero.maxAp,
        heroAction: prev.hero.maxHeroAction,
      },
      torch: newTorch,
      gameOver,
    }))
    addLog(`${state.hero.name} pauses to regroup.`)
    addLog(`Torch advances to ${newTorch}/20.`)
  }, [state, addLog])

  const resetGame = useCallback(() => {
    localStorage.removeItem('dungeon-state')
    setState(loadState())
    setEventLog([])
  }, [])

  const moveHero = useCallback(
    (r, c) => {
      const { hero, board, deck, encounter } = state
      if (!hero || hero.movement <= 0 || encounter) return
      const dr = r - hero.row
      const dc = c - hero.col
      if (Math.abs(dr) + Math.abs(dc) !== 1) return
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return

      const dir = directionFromDelta(dr, dc)
      const currentTile = board[hero.row][hero.col]
      if (!currentTile.paths[dir]) return

      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      let newDeck = deck
      const target = newBoard[r][c]
      let revealedGoblin = false
      if (!target.revealed) {
        const room = newDeck[0]
        const roomId = room.roomId
        newDeck = newDeck.slice(1)

        const incoming = opposite(dir)
        const paths = { ...room.paths }
        paths[incoming] = true

        let goblin = null
        if (room.goblin) {
          const typeKey = room.goblin === 'king' ? 'king' : randomGoblinType()
          goblin = { ...GOBLIN_TYPES[typeKey], type: typeKey }
          revealedGoblin = true
        }

        newBoard[r][c] = {
          row: r,
          col: c,
          roomId,
          revealed: true,
          paths,
          goblin,
          trap: room.trap ? { ...TRAP_TYPES[room.trap], id: room.trap } : null,
          trapResolved: false,
          effect: null,
        }
      } else if (!target.paths[opposite(dir)]) {
        return
      }

      let newHero = {
        ...hero,
        row: r,
        col: c,
        movement: hero.movement - 1,
        offset: {
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
        },
      }

      if (revealedGoblin) {
        newHero.hp = hero.hp - 1
      }

      let newTrap = null
      if (newBoard[r][c].goblin) {
        newHero.movement = 0
      }

      if (newBoard[r][c].trap && !newBoard[r][c].trapResolved) {
        newTrap = { position: { row: r, col: c }, trap: newBoard[r][c].trap }
      }

      setState(prev => ({
        ...prev,
        board: newBoard,
        hero: newHero,
        deck: newDeck,
        encounter: null,
        trap: newTrap,
      }))
      if (revealedGoblin) {
        setRevealGoblin({ goblin: newBoard[r][c].goblin, row: r, col: c })
      }
      addLog(`${hero.name} advances ${dir}, eyes on the shadows.`)
      if (newBoard[r][c].goblin) {
        addLog(`A ${newBoard[r][c].goblin.name} leaps from the darkness!`)
        if (revealedGoblin) addLog('The ambush wounds you for 1 HP.')
      }
      if (newTrap) {
        const t = newTrap.trap
        addLog(`You spot a ${t.id} trap—difficulty ${t.difficulty}.`)
      }
    },
    [state, addLog]
  )

  const engageGoblin = useCallback(
    (r, c) => {
      const { hero, board, encounter } = state
      if (!hero || encounter) return
      const tile = board[r][c]
      if (!tile.goblin || tile.goblin.hp <= 0) return

      const rangeDist = distanceToTarget(board, hero, r, c)
      const magicDist = distanceMagic(board, hero, r, c)
      const dist = Math.min(rangeDist, magicDist)
      if (dist === Infinity) return

      const canAttack = hero.weapons.some(w => {
        if (w.attackType === 'melee') return dist === 0
        if (w.attackType === 'range')
          return rangeDist > 0 && rangeDist <= w.range && rangeDist !== Infinity
        if (w.attackType === 'magic')
          return (
            magicDist > 0 && magicDist <= w.range && magicDist !== Infinity
          )
        return false
      })
      if (!canAttack) return

      setState(prev => ({
        ...prev,
        encounter: {
          goblin: { ...tile.goblin },
          position: { row: r, col: c },
          prev: { row: hero.row, col: hero.col },
          distanceRange: rangeDist,
          distanceMagic: magicDist,
          distance: dist,
        },
      }))
      addLog(
        `${hero.name} strikes at ${tile.goblin.name}${dist > 0 ? ' from afar' : ''}!`,
      )
    },
    [state, addLog],
  )

  const promptHeroAction = useCallback(
    (message, onConfirm) => {
      if (state.hero.heroAction <= 0) return
      setActionPrompt({ message, onConfirm })
    },
    [state.hero],
  )

  const promptAttack = useCallback(
    (r, c) => {
      promptHeroAction('attack', () => engageGoblin(r, c))
    },
    [promptHeroAction, engageGoblin],
  )

  const confirmAction = useCallback(() => {
    if (!actionPrompt) return
    setState(prev => {
      if (!prev.hero) return prev
      return {
        ...prev,
        hero: { ...prev.hero, heroAction: Math.max(0, prev.hero.heroAction - 1) },
      }
    })
    actionPrompt.onConfirm()
    setActionPrompt(null)
  }, [actionPrompt])

  const cancelAction = useCallback(() => setActionPrompt(null), [])

  const possibleMoves = useMemo(() => {
    const { hero, board, encounter } = state
    if (!hero || hero.movement <= 0 || encounter) return []
    const tile = board[hero.row][hero.col]
    const moves = []
    if (tile.paths.up && hero.row > 0) {
      const t = board[hero.row - 1][hero.col]
      if (!t.revealed || t.paths.down) moves.push({ row: hero.row - 1, col: hero.col })
    }
    if (tile.paths.down && hero.row < BOARD_SIZE - 1) {
      const t = board[hero.row + 1][hero.col]
      if (!t.revealed || t.paths.up) moves.push({ row: hero.row + 1, col: hero.col })
    }
    if (tile.paths.left && hero.col > 0) {
      const t = board[hero.row][hero.col - 1]
      if (!t.revealed || t.paths.right) moves.push({ row: hero.row, col: hero.col - 1 })
    }
    if (tile.paths.right && hero.col < BOARD_SIZE - 1) {
      const t = board[hero.row][hero.col + 1]
      if (!t.revealed || t.paths.left) moves.push({ row: hero.row, col: hero.col + 1 })
    }
    return moves
  }, [state])

  const attackTargets = useMemo(() => {
    const { hero, board, encounter } = state
    if (!hero || encounter) return []
    const targets = []
    const tile = board[hero.row][hero.col]
    if (tile.goblin && tile.goblin.hp > 0) {
      targets.push({ row: hero.row, col: hero.col })
    }
    hero.weapons.forEach(w => {
      if (w.range > 0) {
        if (w.attackType === 'range' && w.dice === 'agility') {
          getRangedTargets(board, hero, w.range).forEach(t => {
            if (!targets.some(pt => pt.row === t.row && pt.col === t.col)) {
              targets.push(t)
            }
          })
        } else if (w.attackType === 'magic' && w.dice === 'magic') {
          getMagicTargets(board, hero, w.range).forEach(t => {
            if (!targets.some(pt => pt.row === t.row && pt.col === t.col)) {
              targets.push(t)
            }
          })
        }
      }
    })
    return targets
  }, [state])

  const goblinCount = useMemo(
    () =>
      state.board.reduce(
        (acc, row) =>
          acc + row.reduce((a, t) => a + (t.goblin && t.goblin.hp > 0 ? 1 : 0), 0),
        0,
      ),
    [state.board],
  )

  const {
    applyDiceRewards,
    applySkillCost,
    handleFight,
    handleFlee,
    handleTrapResolve,
    handleRewardConfirm,
    handleDiscardConfirm,
  } = useEncounterHandlers(setState, addLog)

  useEffect(() => {
    if (!state.hero) return
    const handler = e => {
      if (state.encounter || state.trap || state.discard || state.reward) return
      const { row, col } = state.hero
      if (e.key === 'ArrowUp') moveHero(row - 1, col)
      if (e.key === 'ArrowDown') moveHero(row + 1, col)
      if (e.key === 'ArrowLeft') moveHero(row, col - 1)
      if (e.key === 'ArrowRight') moveHero(row, col + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.hero, state.encounter, state.trap, state.discard, state.reward, moveHero])

  if (!state.hero) {
    return <HeroSelect onSelect={chooseHero} />
  }

  return (
    <>
      <div className="main">
        <div className="goblin-column">
          <div className="goblin-area">
            {state.discoveredGoblins.map(g => {
              const gob = state.board[g.row][g.col].goblin
              return gob ? (
                <GoblinToken key={`${g.row}-${g.col}`} goblin={gob} />
              ) : null
            })}
          </div>
        </div>
        <div className="board-column">
          <div className="board-wrapper">
            <div className="board">
          {state.board.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const move = possibleMoves.some(p => p.row === rIdx && p.col === cIdx)
              const attack = attackTargets.some(p => p.row === rIdx && p.col === cIdx)
              const disabled = !move && !attack && (state.hero.row !== rIdx || state.hero.col !== cIdx)
              return (
                <RoomTile
                  key={`${rIdx}-${cIdx}`}
                  tile={tile}
                  highlight={move || attack}
                  move={move}
                  attack={attack}
                  attackDisabled={state.hero.heroAction <= 0}
                  disabled={disabled}
                  onMove={() => moveHero(rIdx, cIdx)}
                  onAttack={() => promptAttack(rIdx, cIdx)}
                />
              )
            })
          )}
          {state.hero && (
            <div
              className={`hero-overlay${heroDamaged ? ' shake' : ''}`}
              style={{
                transform: `translate(${state.hero.col * 100 + (state.hero.offset?.x ?? 0)}%, ${
                  state.hero.row * 100 + (state.hero.offset?.y ?? 0)
                }%)`,
              }}
            >
              <Hero hero={state.hero} damaged={heroDamaged} />
            </div>
          )}
          {revealGoblin && (
            <div
              className={`goblin-reveal ${revealPhase}`}
              style={{
                top: `calc(${revealGoblin.row} * (100% / ${BOARD_SIZE}))`,
                left: `calc(${revealGoblin.col} * (100% / ${BOARD_SIZE}))`,
              }}
            >
              <GoblinCard goblin={revealGoblin.goblin} />
            </div>
          )}
            </div>
          </div>
          <TorchMat step={state.torch} />
        </div>
        <div className="side">
        <EventLog log={eventLog.slice(-3)} className="narrative-log" />
        <HeroPanel hero={state.hero} damaged={heroDamaged} />
        {state.hero && (
          <div className="hero-items">
            {state.hero.weapons.map((w, idx) => (
              <ItemCard key={idx} item={w} />
            ))}
          </div>
        )}
        <button onClick={endTurn} className="end-turn">End Turn</button>
      </div>
      {state.encounter && (
        <EncounterModal
          goblin={state.encounter.goblin}
          hero={state.hero}
          goblinCount={goblinCount}
          distanceRange={state.encounter.distanceRange}
          distanceMagic={state.encounter.distanceMagic}
          onReward={applyDiceRewards}
          onSkill={applySkillCost}
          onFight={handleFight}
          onFlee={handleFlee}
        />
      )}
      {state.trap && (
        <TrapModal
          hero={state.hero}
          trap={state.trap.trap}
          onResolve={handleTrapResolve}
          onHeroAction={promptHeroAction}
        />
      )}
      {state.reward && (
        <RewardModal reward={state.reward} onConfirm={handleRewardConfirm} />
      )}
      {state.discard && (
        <DiscardModal items={state.discard.items} onConfirm={handleDiscardConfirm} />
      )}
      {actionPrompt && (
        <ConfirmModal
          message={`Are you sure you want to ${actionPrompt.message}?`}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
      <button className="dev-toggle" onClick={() => setShowDevModal(true)}>Dev</button>
      {showDevModal && (
        <DeveloperModal
          log={eventLog}
          onReset={resetGame}
          onClose={() => setShowDevModal(false)}
        />
      )}
      {state.gameOver && <GameOverModal onReset={resetGame} />}
    </div>
  </>
)
}

export default App
