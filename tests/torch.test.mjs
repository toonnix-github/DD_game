import assert from 'assert'
import { spawnGoblin, countGoblins, TORCH_EVENTS } from '../src/torch.js'

const BOARD_SIZE = 7
const CENTER = Math.floor(BOARD_SIZE / 2)
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

function testSpawnGoblin() {
  const board = createEmptyBoard()
  const newBoard = spawnGoblin(board)
  assert.ok(newBoard[CENTER][CENTER].goblin)
}

function testCountGoblins() {
  const board = createEmptyBoard()
  board[CENTER][CENTER].goblin = { hp: 1 }
  assert.strictEqual(countGoblins(board), 1)
}

function testEventsCount() {
  assert.strictEqual(TORCH_EVENTS.length, 20)
}

function run() {
  testSpawnGoblin()
  testCountGoblins()
  testEventsCount()
  console.log('All torch tests passed')
}

run()
