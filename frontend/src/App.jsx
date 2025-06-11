import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import RoomTile from './components/RoomTile'
import Hero from './components/Hero'
import HeroPanel from './components/HeroPanel'
import ItemCard from './components/ItemCard'
import HeroSelect from './components/HeroSelect'
import EncounterModal from './components/EncounterModal'
import TrapModal from './components/TrapModal'
import { TRAP_TYPES } from './trapRules'
import DiscardModal from './components/DiscardModal'
import RewardModal from './components/RewardModal'
import { createShuffledDeck } from './roomDeck'
import './App.css'
import { HERO_TYPES } from './heroData'
import { GOBLIN_TYPES, randomGoblinType } from './goblinData'
import { fightGoblin, computeUnusedRewards } from './fightUtils'
import { randomTreasure, adaptTreasureItem } from './treasureDeck'

const BOARD_SIZE = 7
const CENTER = Math.floor(BOARD_SIZE / 2)

const DIRS = ['up', 'down', 'left', 'right']

function directionFromDelta(dr, dc) {
  if (dr === -1) return 'up'
  if (dr === 1) return 'down'
  if (dc === -1) return 'left'
  if (dc === 1) return 'right'
  return null
}

function opposite(dir) {
  switch (dir) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    default:
      return null
  }
}


function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => ({
      row: r,
      col: c,
      roomId: null,
      revealed: false,
      paths: { up: false, down: false, left: false, right: false },
      goblin: null,
      effect: null,
    }))
  )
}

function loadState() {
  const saved = localStorage.getItem('dungeon-state')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.board) {
        parsed.board.forEach(row =>
          row.forEach(tile => {
            if (!tile.paths) tile.paths = { up: false, down: false, left: false, right: false }
            if (!('goblin' in tile)) tile.goblin = null
            if (!('trap' in tile)) tile.trap = null
            if (tile.trap && typeof tile.trap === 'string') {
              tile.trap = { ...TRAP_TYPES[tile.trap], id: tile.trap }
            }
            if (!('trapResolved' in tile)) tile.trapResolved = false
            if (!('effect' in tile)) tile.effect = null
          })
        )
      }
      if (parsed.hero) {
        const type = parsed.hero.type || 'knight'
        const base = HERO_TYPES[type]
        const maxHp = parsed.hero.maxHp ?? base.maxHp ?? base.hp
        const maxAp = parsed.hero.maxAp ?? base.maxAp ?? base.ap
        const skill = parsed.hero.skill ?? base.skill
        parsed.hero = {
          row: parsed.hero.row,
          col: parsed.hero.col,
          skill: typeof skill === 'object' ? { ...skill } : skill,
          movement: parsed.hero.movement ?? base.movement,
          icon: parsed.hero.icon ?? base.icon,
          hp: Math.min(parsed.hero.hp ?? base.hp, maxHp),
          maxHp,
          ap: Math.min(parsed.hero.ap ?? base.ap, maxAp),
          maxAp,
          defence: parsed.hero.defence ?? base.defence,
          strengthDice: parsed.hero.strengthDice ?? base.strengthDice,
          agilityDice: parsed.hero.agilityDice ?? base.agilityDice,
          magicDice: parsed.hero.magicDice ?? base.magicDice,
          weapons: parsed.hero.weapons ?? base.weapons.map(w => ({ ...w })),
          name: base.name,
          image: base.image,
          type,
          offset: parsed.hero.offset ?? { x: 0, y: 0 },
        }
      }
      parsed.encounter = null
      if (!parsed.trap) parsed.trap = null
      if (!parsed.discard) parsed.discard = null
      if (!parsed.reward || !parsed.reward.item) parsed.reward = null
      return parsed
    } catch {
      /* ignore corrupted save */
    }
  }
  const board = createEmptyBoard()
  board[CENTER][CENTER] = {
    row: CENTER,
    col: CENTER,
    roomId: 'Start',
    revealed: true,
    paths: { up: true, down: true, left: true, right: true },
    goblin: null,
    effect: null,
  }
  return {
    board,
    hero: null,
    deck: createShuffledDeck(),
    encounter: null,
    trap: null,
    discard: null,
    reward: null,
  }
}

function App() {
  const [state, setState] = useState(loadState)
  const [heroDamaged, setHeroDamaged] = useState(false)
  const prevHpRef = useRef(state.hero ? state.hero.hp : null)

  const chooseHero = useCallback(type => {
    const base = HERO_TYPES[type]
    const skill = base.skill
    const hero = {
      row: CENTER,
      col: CENTER,
      name: base.name,
      skill: typeof skill === 'object' ? { ...skill } : skill,
      movement: base.movement,
      icon: base.icon,
      hp: base.hp,
      maxHp: base.maxHp ?? base.hp,
      ap: base.ap,
      maxAp: base.maxAp ?? base.ap,
      defence: base.defence,
      strengthDice: base.strengthDice,
      agilityDice: base.agilityDice,
      magicDice: base.magicDice,
      weapons: base.weapons.map(w => ({ ...w })),
      image: base.image,
      type,
      offset: {
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
      },
    }
    setState(prev => ({ ...prev, hero }))
  }, [])

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

  const endTurn = useCallback(() => {
    setState(prev => {
      if (!prev.hero) return prev
      const base = HERO_TYPES[prev.hero.type]
      return {
        ...prev,
        hero: {
          ...prev.hero,
          movement: base.movement,
          ap: prev.hero.maxAp,
        },
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    localStorage.removeItem('dungeon-state')
    setState(loadState())
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

      let newEncounter = null
      let newTrap = null
      if (newBoard[r][c].goblin) {
        newHero.movement = 0
        newEncounter = {
          goblin: { ...newBoard[r][c].goblin },
          position: { row: r, col: c },
          prev: { row: hero.row, col: hero.col },
        }
      }

      if (newBoard[r][c].trap && !newBoard[r][c].trapResolved && !newEncounter) {
        newHero.movement = 0
        newTrap = { position: { row: r, col: c }, trap: newBoard[r][c].trap }
      }

      setState({ board: newBoard, hero: newHero, deck: newDeck, encounter: newEncounter, trap: newTrap })
    },
    [state]
  )

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

  const handleFight = useCallback((rolls, baseIdx, weaponIdx, extraIdxs, rewards, skillUsed = false) => {
    setState(prev => {
      const { encounter, board, hero } = prev
      if (!encounter) return prev
      const weapon = hero.weapons[weaponIdx]
      const bonus = skillUsed && hero.skill && hero.skill.bonus ? hero.skill.bonus : 0
      const result = fightGoblin(hero, encounter.goblin, weapon, rolls, baseIdx, extraIdxs, bonus)
      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      const tile = newBoard[encounter.position.row][encounter.position.col]
      let newEncounter = { ...encounter, goblin: result.goblin }
      let newHero = result.hero
      let discard = prev.discard
      let reward = prev.reward
      tile.goblin = result.goblin
      const row = encounter.position.row
      const col = encounter.position.col
      if (!rewards) {
        rewards = computeUnusedRewards(rolls, baseIdx, extraIdxs)
      }
      newHero = {
        ...newHero,
        ap: Math.min(newHero.ap + rewards.ap, newHero.maxAp),
        hp: Math.min(newHero.hp + rewards.hp, newHero.maxHp),
      }
      if (skillUsed && hero.skill && hero.skill.cost) {
        newHero.ap = Math.max(0, newHero.ap - hero.skill.cost)
      }

      if (result.goblin.hp <= 0) {
        tile.goblin = null
        tile.effect = 'death'
        newEncounter = null
        const item = adaptTreasureItem(randomTreasure())
        newHero = { ...newHero, weapons: [...newHero.weapons, item] }
        reward = { item, hp: 0 }
        discard = null
        setTimeout(() => {
          setState(p => {
            const copy = p.board.map(r => r.map(t => ({ ...t })))
            const t = copy[row][col]
            if (t.effect === 'death') t.effect = null
            return { ...p, board: copy }
          })
        }, 600)
      } else if (result.counter) {
        // end encounter after counterattack
        newEncounter = null
      }
      return { ...prev, board: newBoard, hero: newHero, encounter: newEncounter, reward, discard }
    })
  }, [])

  const handleFlee = useCallback(success => {
    setState(prev => {
      if (!prev.encounter) return prev
      const { encounter, board, hero } = prev
      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      let newHero = { ...hero, movement: 0 }
      let newEncounter = encounter
      if (success) {
        newHero.row = encounter.prev.row
        newHero.col = encounter.prev.col
        newHero.offset = {
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
        }
        newEncounter = null
      } else {
        const damage = Math.max(1, encounter.goblin.attack - hero.defence)
        newHero.hp = hero.hp - damage
      }
      return { ...prev, board: newBoard, hero: newHero, encounter: newEncounter }
    })
  }, [])

  const handleTrapResolve = useCallback(success => {
    setState(prev => {
      const { trap, board, hero } = prev
      if (!trap) return prev
      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      const tile = newBoard[trap.position.row][trap.position.col]
      tile.trapResolved = success
      let newHero = { ...hero }
      let discard = null
      let reward = prev.reward
      if (success) {
        const item = adaptTreasureItem(randomTreasure())
        newHero.weapons = [...hero.weapons, item]
        newHero.hp = Math.min(hero.hp + tile.trap.reward, hero.maxHp)
        reward = { item, hp: tile.trap.reward }
      }
      if (!success) {
        newHero.hp = hero.hp - tile.trap.damage
      }
      return { ...prev, board: newBoard, hero: newHero, trap: null, reward, discard }
    })
  }, [])

  const handleRewardConfirm = useCallback(() => {
    setState(prev => {
      if (!prev.reward) return prev
      let discard = null
      if (prev.hero.weapons.length > 2) {
        discard = { items: prev.hero.weapons }
      }
      return { ...prev, reward: null, discard }
    })
  }, [])

  const handleDiscardConfirm = useCallback(items => {
    setState(prev => ({ ...prev, hero: { ...prev.hero, weapons: items }, discard: null }))
  }, [])

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
        <div className="board">
          {state.board.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const highlight = possibleMoves.some(p => p.row === rIdx && p.col === cIdx)
              const disabled = !highlight && (state.hero.row !== rIdx || state.hero.col !== cIdx)
              return (
                <RoomTile
                  key={`${rIdx}-${cIdx}`}
                  tile={tile}
                  highlight={highlight}
                  disabled={disabled}
                  onClick={() => moveHero(rIdx, cIdx)}
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
        </div>
      <div className="side">
        <HeroPanel hero={state.hero} damaged={heroDamaged} />
        {state.hero && (
          <div className="hero-items">
            {state.hero.weapons.map((w, idx) => (
              <ItemCard key={idx} item={w} />
            ))}
          </div>
        )}
        <button onClick={endTurn} className="end-turn">End Turn</button>
        <button onClick={resetGame} className="reset-game">Reset Game</button>
      </div>
      {state.encounter && (
        <EncounterModal
          goblin={state.encounter.goblin}
          hero={state.hero}
          onFight={handleFight}
          onFlee={handleFlee}
        />
      )}
      {state.trap && (
        <TrapModal hero={state.hero} trap={state.trap.trap} onResolve={handleTrapResolve} />
      )}
      {state.reward && (
        <RewardModal reward={state.reward} onConfirm={handleRewardConfirm} />
      )}
      {state.discard && (
        <DiscardModal items={state.discard.items} onConfirm={handleDiscardConfirm} />
      )}
    </div>
  </>
)
}

export default App
