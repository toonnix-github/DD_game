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

export function roomCode(row, col) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return `${letters[row]}${col + 1}`
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
export function getMagicTargets(board, hero, range) {
  const dirs = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const visited = new Set();
  const queue = [{ r: hero.row, c: hero.col, steps: 0 }];
  visited.add(`${hero.row},${hero.col}`);
  const targets = [];
  while (queue.length > 0) {
    const { r, c, steps } = queue.shift();
    if (steps >= range) continue;
    const tile = board[r][c];
    Object.entries(dirs).forEach(([dir, [dr, dc]]) => {
      if (!tile.paths[dir]) return;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= board.length || nc < 0 || nc >= board[0].length) return;
      const next = board[nr][nc];
      if (!next.revealed || !next.paths[opposite(dir)]) return;
      const key = `${nr},${nc}`;
      if (visited.has(key)) return;
      visited.add(key);
      if (next.goblin && next.goblin.hp > 0) {
        targets.push({ row: nr, col: nc });
      }
      queue.push({ r: nr, c: nc, steps: steps + 1 });
    });
  }
  return targets;
}

export function distanceMagic(board, hero, row, col) {
  const dirs = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const visited = new Set();
  const queue = [{ r: hero.row, c: hero.col, steps: 0 }];
  visited.add(`${hero.row},${hero.col}`);
  while (queue.length > 0) {
    const { r, c, steps } = queue.shift();
    if (r === row && c === col) return steps;
    const tile = board[r][c];
    Object.entries(dirs).forEach(([dir, [dr, dc]]) => {
      if (!tile.paths[dir]) return;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= board.length || nc < 0 || nc >= board[0].length) return;
      const next = board[nr][nc];
      if (!next.revealed || !next.paths[opposite(dir)]) return;
      const key = `${nr},${nc}`;
      if (visited.has(key)) return;
      visited.add(key);
      queue.push({ r: nr, c: nc, steps: steps + 1 });
    });
  }
  return Infinity;
}

export function nextStepTowards(board, fromRow, fromCol, toRow, toCol) {
  const dirs = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };
  const visited = new Set();
  const queue = [{ r: fromRow, c: fromCol, path: [] }];
  visited.add(`${fromRow},${fromCol}`);
  while (queue.length > 0) {
    const { r, c, path } = queue.shift();
    if (r === toRow && c === toCol) return path[0] || null;
    const tile = board[r][c];
    Object.entries(dirs).forEach(([dir, [dr, dc]]) => {
      if (!tile.paths[dir]) return;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= board.length || nc < 0 || nc >= board[0].length) return;
      const next = board[nr][nc];
      if (!next.revealed || !next.paths[opposite(dir)]) return;
      const key = `${nr},${nc}`;
      if (visited.has(key)) return;
      visited.add(key);
      queue.push({ r: nr, c: nc, path: [...path, { r: nr, c: nc }] });
    });
  }
  return null;
}

export function getGoblinMoveSteps(board, hero, goblinPositions) {
  const copy = board.map(row => row.map(t => ({ ...t })))
  const newPositions = goblinPositions.map(p => ({ ...p }))
  const steps = []

  const maxMove = Math.max(
    0,
    ...goblinPositions.map(pos => {
      const gob = copy[pos.row][pos.col].goblin
      return gob && gob.hp > 0 ? gob.movement || 1 : 0
    }),
  )

  for (let step = 0; step < maxMove; step++) {
    const logs = []
    let moved = false
    for (let idx = 0; idx < goblinPositions.length; idx++) {
      const pos = newPositions[idx]
      const tile = copy[pos.row][pos.col]
      const gob = tile.goblin
      if (!gob || gob.hp <= 0) continue
      if (step >= (gob.movement || 1)) continue

      const next = nextStepTowards(copy, pos.row, pos.col, hero.row, hero.col)
      if (!next) continue
      const { r: nr, c: nc } = next
      if (copy[nr][nc].goblin && copy[nr][nc].goblin.hp > 0) continue

      copy[nr][nc] = { ...copy[nr][nc], goblin: gob }
      copy[pos.row][pos.col] = { ...tile, goblin: null }
      newPositions[idx] = { row: nr, col: nc }
      logs.push(`${gob.name} moves to ${roomCode(nr, nc)}.`)
      moved = true
    }
    if (moved) {
      const stepBoard = copy.map(row => row.map(t => ({ ...t })))
      const stepPositions = newPositions.map(p => ({ ...p }))
      steps.push({ board: stepBoard, positions: stepPositions, logs })
    }
  }

  return { board: copy, positions: newPositions, steps }
}

export function moveGoblinsTowardsHero(board, hero, goblinPositions) {
  const { board: b, positions, steps } = getGoblinMoveSteps(
    board,
    hero,
    goblinPositions,
  )
  const logs = steps.flatMap(s => s.logs)
  return { board: b, positions, logs, steps }
}
