import { useCallback, useEffect, useMemo, useState } from 'react'
import RoomTile from './components/RoomTile'
import HeroPanel from './components/HeroPanel'
import HeroSelect from './components/HeroSelect'
import { ROOM_DECK } from './roomDeck'
import './App.css'
import { HERO_TYPES } from './heroData'

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
          type,
        }
      }
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
  }
  return {
    board,
    hero: null,
    deck: ROOM_DECK.slice(),
  }
}

function App() {
  const [state, setState] = useState(loadState)

  const chooseHero = useCallback(type => {
    const base = HERO_TYPES[type]
    const hero = {
      row: CENTER,
      col: CENTER,
      movement: base.movement,
      icon: base.icon,
      hp: base.hp,
      ap: base.ap,
      attack: base.attack,
      defence: base.defence,
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

  const moveHero = useCallback(
    (r, c) => {
      const { hero, board, deck } = state
      if (!hero || hero.movement <= 0) return
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

        newBoard[r][c] = {
          row: r,
          col: c,
          roomId,
          revealed: true,
          paths,
        }
      } else if (!target.paths[opposite(dir)]) {
        return
      }

      const newHero = {
        ...hero,
        row: r,
        col: c,
        movement: hero.movement - 1,
      }
      setState({ board: newBoard, hero: newHero, deck: newDeck })
    },
    [state]
  )

  const possibleMoves = useMemo(() => {
    const { hero, board } = state
    if (!hero || hero.movement <= 0) return []
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

  useEffect(() => {
    if (!state.hero) return
    const handler = e => {
      const { row, col } = state.hero
      if (e.key === 'ArrowUp') moveHero(row - 1, col)
      if (e.key === 'ArrowDown') moveHero(row + 1, col)
      if (e.key === 'ArrowLeft') moveHero(row, col - 1)
      if (e.key === 'ArrowRight') moveHero(row, col + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.hero, moveHero])

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
                  hero={state.hero}
                  highlight={highlight}
                  onClick={() => moveHero(rIdx, cIdx)}
                />
              )
            })
          )}
        </div>
        <div className="side">
          <HeroPanel hero={state.hero} />
          <button onClick={endTurn} className="end-turn">End Turn</button>
        </div>
      </div>
    </>
  )
}

export default App
