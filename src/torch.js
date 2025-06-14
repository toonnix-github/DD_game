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
import { distanceToTarget, distanceMagic, nextStepTowards } from './boardUtils.js';
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
      let goblin = tile.goblin;
      if (!goblin || goblin.hp <= 0 || newHero.hp <= 0) return;
      let r = tile.row;
      let c = tile.col;
      for (let m = 0; m < (goblin.movement || 0); m++) {
        if (r === newHero.row && c === newHero.col) break;
        const step = nextStepTowards(newBoard, r, c, newHero.row, newHero.col);
        if (!step) break;
        if (newBoard[step.row][step.col].goblin) break;
        newBoard[step.row][step.col].goblin = goblin;
        newBoard[r][c].goblin = null;
        r = step.row;
        c = step.col;
      }
      const rangeDist = distanceToTarget(newBoard, newHero, r, c);
      const magicDist = distanceMagic(newBoard, newHero, r, c);
      const dist = Math.min(rangeDist, magicDist);
      if (dist === Infinity) return;
      const res = monsterCounter(newHero, newHero.weapons[0], goblin, dist, 1);
      if (res && res.effect !== 'torchDown') {
        newHero.hp -= res.damage;
        newHero.defence = res.heroDefenceAfter;
      }
    });
  });
  return { board: newBoard, hero: newHero };
}
