import assert from 'assert';
import { getRangedTargets, distanceToTarget } from '../frontend/src/boardUtils.js';

function makeTile(row, col, paths, goblin=null) {
  return { row, col, revealed: true, paths, goblin };
}

function createBoard() {
  const rows = 3;
  const cols = 4;
  const board = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeTile(r, c, { up:false,down:false,left:false,right:false }))
  );
  // connect horizontal line in row 1
  board[1][0].paths.right = true;
  board[1][1].paths.left = true; board[1][1].paths.right = true;
  board[1][2].paths.left = true; board[1][2].paths.right = true;
  board[1][3].paths.left = true;
  return board;
}

function testRangedTarget() {
  const board = createBoard();
  board[1][3].goblin = { hp: 2 };
  const hero = { row:1, col:1 };
  const targets = getRangedTargets(board, hero, 3);
  assert.deepStrictEqual(targets, [{ row:1, col:3 }]);
}

function testBlockedPath() {
  const board = createBoard();
  board[1][2].paths.left = false; // break path
  board[1][3].goblin = { hp:2 };
  const hero = { row:1, col:1 };
  const targets = getRangedTargets(board, hero, 3);
  assert.strictEqual(targets.length, 0);
}

function testOutOfRange() {
  const board = createBoard();
  board[1][3].goblin = { hp:2 };
  const hero = { row:1, col:1 };
  const targets = getRangedTargets(board, hero, 1);
  assert.strictEqual(targets.length, 0);
}

function testDistance() {
  const board = createBoard();
  board[1][3].goblin = { hp: 2 };
  const hero = { row: 1, col: 1 };
  const dist = distanceToTarget(board, hero, 1, 3);
  assert.strictEqual(dist, 2);
}

function testDistanceBlocked() {
  const board = createBoard();
  board[1][2].paths.left = false;
  const hero = { row: 1, col: 1 };
  const dist = distanceToTarget(board, hero, 1, 3);
  assert.strictEqual(dist, Infinity);
}

function run() {
  testRangedTarget();
  testBlockedPath();
  testOutOfRange();
  testDistance();
  testDistanceBlocked();
  console.log('All range weapon tests passed');
}

run();
