export const TORCH_EVENTS = [
  null,
  null,
  null,
  'spawn',
  'monster',
  null,
  'spawn',
  'monster',
  'spawn',
  'monster',
  null,
  'spawn',
  'monster',
  null,
  'spawn',
  'monster',
  null,
  'spawn',
  'monster',
  'gameover',
];

import { randomGoblinType, GOBLIN_TYPES } from './goblinData.js';
import { distanceToTarget, distanceMagic } from './boardUtils.js';
import { monsterCounter } from './fightUtils.js';

export function spawnGoblin(board) {
  const newBoard = board.map(row => row.map(t => ({ ...t })));
  const center = Math.floor(newBoard.length / 2);
  const tile = newBoard[center][center];
  if (!tile.goblin) {
    const typeKey = randomGoblinType();
    tile.goblin = { ...GOBLIN_TYPES[typeKey], type: typeKey };
  }
  return newBoard;
}

export function countGoblins(board) {
  return board.reduce(
    (acc, row) => acc + row.reduce((a, t) => a + (t.goblin && t.goblin.hp > 0 ? 1 : 0), 0),
    0,
  );
}

export function monsterActions(board, hero) {
  const newBoard = board.map(row => row.map(t => ({ ...t })));
  let newHero = { ...hero };
  newBoard.forEach(row => {
    row.forEach(tile => {
      if (!tile.goblin || tile.goblin.hp <= 0 || newHero.hp <= 0) return;
      const rangeDist = distanceToTarget(newBoard, newHero, tile.row, tile.col);
      const magicDist = distanceMagic(newBoard, newHero, tile.row, tile.col);
      const dist = Math.min(rangeDist, magicDist);
      if (dist === Infinity) return;
      const res = monsterCounter(newHero, newHero.weapons[0], tile.goblin, dist, 1);
      if (res && res.effect !== 'torchDown') {
        newHero.hp -= res.damage;
        newHero.defence = res.heroDefenceAfter;
      }
    });
  });
  return { board: newBoard, hero: newHero };
}
