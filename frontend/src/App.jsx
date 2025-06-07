import { useCallback, useEffect, useMemo, useState } from 'react'
import RoomTile from './components/RoomTile'
import './App.css'

const BOARD_SIZE = 7
const CENTER = Math.floor(BOARD_SIZE / 2)

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => ({
      row: r,
      col: c,
      roomId: null,
      revealed: false,
    }))
  )
}

function loadState() {
  const saved = localStorage.getItem('dungeon-state')
  if (saved) return JSON.parse(saved)
  const board = createEmptyBoard()
  board[CENTER][CENTER] = { row: CENTER, col: CENTER, roomId: 'Start', revealed: true }
  return {
    board,
    hero: { row: CENTER, col: CENTER, movement: 3, icon: 'H' },
    deck: Array.from({ length: 60 }, (_, i) => i + 1),
  }
}

function App() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem('dungeon-state', JSON.stringify(state))
  }, [state])

  const moveHero = useCallback(
    (r, c) => {
      const { hero, board, deck } = state
      if (hero.movement <= 0) return
      const dr = Math.abs(r - hero.row)
      const dc = Math.abs(c - hero.col)
      if (dr + dc !== 1) return
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return

      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      let newDeck = deck
      if (!newBoard[r][c].revealed) {
        const idx = Math.floor(Math.random() * newDeck.length)
        const roomId = newDeck[idx]
        newDeck = newDeck.filter((_, i) => i !== idx)
        newBoard[r][c] = { row: r, col: c, roomId, revealed: true }
      }
      const newHero = { ...hero, row: r, col: c, movement: hero.movement - 1 }
      setState({ board: newBoard, hero: newHero, deck: newDeck })
    },
    [state]
  )

  const possibleMoves = useMemo(() => {
    const { hero } = state
    if (hero.movement <= 0) return []
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    return dirs
      .map(([dr, dc]) => ({ row: hero.row + dr, col: hero.col + dc }))
      .filter(p => p.row >= 0 && p.row < BOARD_SIZE && p.col >= 0 && p.col < BOARD_SIZE)
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
