export function opposite(dir) {
  switch (dir) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    default:
      return null;
  }
}

export function getRangedTargets(board, hero, range) {
  const dirs = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const targets = [];
  Object.entries(dirs).forEach(([dir, [dr, dc]]) => {
    let r = hero.row;
    let c = hero.col;
    let tile = board[r][c];
    for (let step = 0; step < range; step++) {
      if (!tile.paths[dir]) break;
      r += dr;
      c += dc;
      if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) break;
      const next = board[r][c];
      if (!next.revealed || !next.paths[opposite(dir)]) break;
      if (next.goblin && next.goblin.hp > 0) {
        targets.push({ row: r, col: c });
        break;
      }
      tile = next;
    }
  });
  return targets;
}

