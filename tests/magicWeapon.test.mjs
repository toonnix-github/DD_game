import assert from 'assert';
import { getMagicTargets, distanceMagic, getRangedTargets, distanceToTarget } from '../src/boardUtils.js';
import { TreasureDeck, adaptTreasureItem } from '../src/treasureDeck.js';
import { chooseMonsterAttack } from '../src/fightUtils.js';

function makeTile(row, col, paths, goblin=null) {
  return { row, col, revealed: true, paths, goblin };
}

function createBoard() {
  const rows = 3;
  const cols = 3;
  const board = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeTile(r, c, { up:false,down:false,left:false,right:false }))
  );
  // zig-zag path from (0,0) -> (1,0) -> (1,1) -> (0,1) -> (0,2)
  board[0][0].paths.down = true;
  board[1][0].paths.up = true; board[1][0].paths.right = true;
  board[1][1].paths.left = true; board[1][1].paths.up = true; board[1][1].paths.right = true;
  board[0][1].paths.down = true; board[0][1].paths.right = true;
  board[0][2].paths.left = true;
  return board;
}

function testMagicTarget() {
  const board = createBoard();
  board[0][2].goblin = { hp: 2 };
  const hero = { row:0, col:0 };
  const targets = getMagicTargets(board, hero, 4);
  assert.deepStrictEqual(targets, [{ row:0, col:2 }]);
  const ranged = getRangedTargets(board, hero, 4);
  assert.strictEqual(ranged.length, 0);
}

function testMagicDistance() {
  const board = createBoard();
  const hero = { row:0, col:0 };
  const dist = distanceMagic(board, hero, 0, 2);
  assert.strictEqual(dist, 4);
  board[1][1].paths.up = false; board[0][1].paths.down = false;
  const dist2 = distanceMagic(board, hero, 0, 2);
  assert.strictEqual(dist2, Infinity);
}

function testAdaptTreasureItemMagicDice() {
  const card = TreasureDeck.find(t => t.attack?.type === 'magic');
  const item = adaptTreasureItem(card);
  assert.strictEqual(item.attackType, 'magic');
  assert.strictEqual(item.dice, 'magic');
}

function testMagicCantHitAtZero() {
  const goblin = { attacks: [{ type:'magic', attack:5, range:3 }] };
  const atk = chooseMonsterAttack(goblin, 0);
  assert.strictEqual(atk, null);
}

function run() {
  testMagicTarget();
  testMagicDistance();
  testAdaptTreasureItemMagicDice();
  testMagicCantHitAtZero();
  console.log('All magic weapon tests passed');
}

run();
