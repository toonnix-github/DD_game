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

export function distanceToTarget(board, hero, row, col) {
  if (hero.row === row && hero.col === col) return 0;
  if (hero.row !== row && hero.col !== col) return Infinity;
  const dir = hero.row === row ? (col > hero.col ? 'right' : 'left') : (row > hero.row ? 'down' : 'up');
  const [dr, dc] = dir === 'up' ? [-1, 0] : dir === 'down' ? [1, 0] : dir === 'left' ? [0, -1] : [0, 1];
  let r = hero.row;
  let c = hero.col;
  let tile = board[r][c];
  let steps = 0;
  while (r !== row || c !== col) {
    if (!tile.paths[dir]) return Infinity;
    r += dr;
    c += dc;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return Infinity;
    const next = board[r][c];
    if (!next.revealed || !next.paths[opposite(dir)]) return Infinity;
    steps++;
    tile = next;
  }
  return steps;
}
