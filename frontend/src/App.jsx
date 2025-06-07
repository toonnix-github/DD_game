import { useCallback, useEffect, useMemo, useState } from 'react'
import RoomTile from './components/RoomTile'
import Hero from './components/Hero'
import HeroPanel from './components/HeroPanel'
import HeroSelect from './components/HeroSelect'
import EncounterModal from './components/EncounterModal'
import { createShuffledDeck } from './roomDeck'
import './App.css'
import { HERO_TYPES } from './heroData'
import { GOBLIN_TYPES, randomGoblinType } from './goblinData'
import { fightGoblin } from './fightUtils'

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
          })
        )
      }
      if (parsed.hero) {
        const type = parsed.hero.type || 'knight'
        const base = HERO_TYPES[type]
        parsed.hero = {
          row: parsed.hero.row,
          col: parsed.hero.col,
          movement: parsed.hero.movement ?? base.movement,
          icon: parsed.hero.icon ?? base.icon,
          hp: parsed.hero.hp ?? base.hp,
          ap: parsed.hero.ap ?? base.ap,
          attack: parsed.hero.attack ?? base.attack,
          defence: parsed.hero.defence ?? base.defence,
          agility: parsed.hero.agility ?? base.agility,
          fightDice: parsed.hero.fightDice ?? base.fightDice,
          fleeDice: parsed.hero.fleeDice ?? base.fleeDice,
          name: base.name,
          image: base.image,
          type,
        }
      }
      parsed.encounter = null
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
  }
  return {
    board,
    hero: null,
    deck: createShuffledDeck(),
    encounter: null,
  }
}

function App() {
  const [state, setState] = useState(loadState)

  const chooseHero = useCallback(type => {
    const base = HERO_TYPES[type]
    const hero = {
      row: CENTER,
      col: CENTER,
      name: base.name,
      movement: base.movement,
      icon: base.icon,
      hp: base.hp,
      ap: base.ap,
      attack: base.attack,
      defence: base.defence,
      agility: base.agility,
      fightDice: base.fightDice,
      fleeDice: base.fleeDice,
      image: base.image,
      type,
    }
    setState(prev => ({ ...prev, hero }))
  }, [])

  useEffect(() => {
    localStorage.setItem('dungeon-state', JSON.stringify(state))
  }, [state])

  const endTurn = useCallback(() => {
    setState(prev => {
      if (!prev.hero) return prev
      const base = HERO_TYPES[prev.hero.type]
      return {
        ...prev,
        hero: { ...prev.hero, movement: base.movement },
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
        }
      } else if (!target.paths[opposite(dir)]) {
        return
      }

      let newHero = {
        ...hero,
        row: r,
        col: c,
        movement: hero.movement - 1,
      }

      let newEncounter = null
      if (newBoard[r][c].goblin) {
        newHero.movement = 0
        newEncounter = {
          goblin: { ...newBoard[r][c].goblin },
          position: { row: r, col: c },
          prev: { row: hero.row, col: hero.col },
        }
      }

      setState({ board: newBoard, hero: newHero, deck: newDeck, encounter: newEncounter })
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

  const handleFight = useCallback(
    (rolls, baseIdx) => {
      const { encounter, board, hero } = state
      if (!encounter) return null
      const result = fightGoblin(hero, encounter.goblin, rolls, baseIdx)
      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      const tile = newBoard[encounter.position.row][encounter.position.col]
      let newEncounter = { ...encounter, goblin: result.goblin }
      tile.goblin = result.goblin
      if (result.goblin.hp <= 0) {
        tile.goblin = null
        newEncounter = null
      }
      setState({ ...state, board: newBoard, hero: result.hero, encounter: newEncounter })
      return result
    },
    [state]
  )

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
        newEncounter = null
      } else {
        const damage = Math.max(1, encounter.goblin.attack - hero.defence)
        newHero.hp = hero.hp - damage
      }
      return { ...prev, board: newBoard, hero: newHero, encounter: newEncounter }
    })
  }, [])

  useEffect(() => {
    if (!state.hero) return
    const handler = e => {
      if (state.encounter) return
      const { row, col } = state.hero
      if (e.key === 'ArrowUp') moveHero(row - 1, col)
      if (e.key === 'ArrowDown') moveHero(row + 1, col)
      if (e.key === 'ArrowLeft') moveHero(row, col - 1)
      if (e.key === 'ArrowRight') moveHero(row, col + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.hero, state.encounter, moveHero])

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
              return (
                <RoomTile
                  key={`${rIdx}-${cIdx}`}
                  tile={tile}
                  highlight={highlight}
                  onClick={() => moveHero(rIdx, cIdx)}
                />
              )
            })
          )}
          {state.hero && (
            <div
              className="hero-overlay"
              style={{
                top: `calc(${state.hero.row} * (100% / ${BOARD_SIZE}))`,
                left: `calc(${state.hero.col} * (100% / ${BOARD_SIZE}))`,
              }}
            >
              <Hero hero={state.hero} />
            </div>
          )}
        </div>
      <div className="side">
        <HeroPanel hero={state.hero} />
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
    </div>
  </>
)
}

export default App
