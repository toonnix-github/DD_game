export const GOBLIN_TYPES = {
  knife: {
    name: 'Knife Goblin',
    hp: 3,
    attack: 2,
    defence: 1,
    icon: 'K',
  },
  archer: {
    name: 'Archer Goblin',
    hp: 2,
    attack: 3,
    defence: 1,
    icon: 'A',
  },
  spear: {
    name: 'Spear Goblin',
    hp: 4,
    attack: 3,
    defence: 2,
    icon: 'S',
  },
  mage: {
    name: 'Mage Goblin',
    hp: 2,
    attack: 4,
    defence: 1,
    icon: 'M',
  },
  king: {
    name: 'Goblin King',
    hp: 6,
    attack: 4,
    defence: 3,
    icon: 'G',
  },
}

export function randomGoblinType(includeKing = false) {
  const keys = Object.keys(GOBLIN_TYPES).filter(k => includeKing || k !== 'king')
  const idx = Math.floor(Math.random() * keys.length)
  return keys[idx]
}
