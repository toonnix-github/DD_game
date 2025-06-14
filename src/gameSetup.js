export const BOARD_SIZE = 7
export const CENTER = Math.floor(BOARD_SIZE / 2)

export const DIRS = ['up', 'down', 'left', 'right']

export function directionFromDelta(dr, dc) {
  if (dr === -1) return 'up'
  if (dr === 1) return 'down'
  if (dc === -1) return 'left'
  if (dc === 1) return 'right'
  return null
}

export function createEmptyBoard() {
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

import { HERO_TYPES } from './heroData'
import { TRAP_TYPES } from './trapRules'
import { createShuffledDeck } from './roomDeck'

export function loadState() {
  const saved = localStorage.getItem('dungeon-state')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.board) {
        parsed.board.forEach(row =>
          row.forEach(tile => {
            if (!tile.paths) tile.paths = { up: false, down: false, left: false, right: false }
            if (!('goblin' in tile)) tile.goblin = null
            if (!('trap' in tile)) tile.trap = null
            if (tile.trap && typeof tile.trap === 'string') {
              tile.trap = { ...TRAP_TYPES[tile.trap], id: tile.trap }
            }
            if (!('trapResolved' in tile)) tile.trapResolved = false
            if (!('effect' in tile)) tile.effect = null
          })
        )
      }
      if (parsed.hero) {
        const type = parsed.hero.type || 'knight'
        const base = HERO_TYPES[type]
        const maxHp = parsed.hero.maxHp ?? base.maxHp ?? base.hp
        const maxAp = parsed.hero.maxAp ?? base.maxAp ?? base.ap
        const skill = parsed.hero.skill ?? base.skill
        const skill2 = parsed.hero.skill2 ?? base.skill2
        const quote = parsed.hero.quote ?? base.quote
        parsed.hero = {
          row: parsed.hero.row,
          col: parsed.hero.col,
          skill: typeof skill === 'object' ? { ...skill } : skill,
          skill2: skill2 ? { ...skill2 } : null,
          movement: parsed.hero.movement ?? base.movement,
          icon: parsed.hero.icon ?? base.icon,
          hp: Math.min(parsed.hero.hp ?? base.hp, maxHp),
          maxHp,
          ap: Math.min(parsed.hero.ap ?? base.ap, maxAp),
          maxAp,
          heroAction: Math.min(
            parsed.hero.heroAction ?? base.heroAction ?? 1,
            base.maxHeroAction ?? 1,
          ),
          maxHeroAction: parsed.hero.maxHeroAction ?? base.maxHeroAction ?? 1,
          defence: parsed.hero.defence ?? base.defence,
          strengthDice: parsed.hero.strengthDice ?? base.strengthDice,
          agilityDice: parsed.hero.agilityDice ?? base.agilityDice,
          magicDice: parsed.hero.magicDice ?? base.magicDice,
          weapons: parsed.hero.weapons ?? base.weapons.map(w => ({ ...w })),
          name: base.name,
          image: base.image,
          quote,
          type,
          offset: parsed.hero.offset ?? { x: 0, y: 0 },
        }
      }
      parsed.encounter = null
      if (!parsed.trap) parsed.trap = null
      if (!parsed.discard) parsed.discard = null
      if (!parsed.reward || !parsed.reward.item) parsed.reward = null
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
    goblin: null,
    effect: null,
  }
  return {
    board,
    hero: null,
    deck: createShuffledDeck(),
    encounter: null,
    trap: null,
    discard: null,
    reward: null,
  }
}
