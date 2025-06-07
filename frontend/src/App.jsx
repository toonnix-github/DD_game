import { useCallback, useEffect, useMemo, useState } from 'react'
import RoomTile from './components/RoomTile'
import './App.css'

const BOARD_SIZE = 7
const CENTER = Math.floor(BOARD_SIZE / 2)
const START_MOVEMENT = 3

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
    hero: { row: CENTER, col: CENTER, movement: START_MOVEMENT, icon: 'H' },
    deck: Array.from({ length: 60 }, (_, i) => i + 1),
  }
}

function App() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem('dungeon-state', JSON.stringify(state))
  }, [state])

  const endTurn = useCallback(() => {
    setState(prev => ({
      ...prev,
      hero: { ...prev.hero, movement: START_MOVEMENT },
    }))
  }, [])

  const moveHero = useCallback(
    (r, c) => {
      const { hero, board, deck } = state
      if (hero.movement <= 0) return
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
        const idx = Math.floor(Math.random() * newDeck.length)
        const roomId = newDeck[idx]
        newDeck = newDeck.filter((_, i) => i !== idx)

        const pathCount = Math.floor(Math.random() * 4) + 1
        const paths = { up: false, down: false, left: false, right: false }
        const incoming = opposite(dir)
        paths[incoming] = true
        let available = DIRS.filter(d => d !== incoming)
        while (Object.values(paths).filter(Boolean).length < pathCount) {
          const ri = Math.floor(Math.random() * available.length)
          const d = available[ri]
          paths[d] = true
          available.splice(ri, 1)
        }

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

      const newHero = { ...hero, row: r, col: c, movement: hero.movement - 1 }
      setState({ board: newBoard, hero: newHero, deck: newDeck })
    },
    [state]
  )

  const possibleMoves = useMemo(() => {
    const { hero, board } = state
    if (hero.movement <= 0) return []
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

  return (
    <>
      <h1>Dungeon Board</h1>
      <button onClick={endTurn}>End Turn</button>
      <p>Movement left: {state.hero.movement}</p>
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
    </>
  )
}

export default App
