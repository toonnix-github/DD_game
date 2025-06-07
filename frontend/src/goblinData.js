export const GOBLIN_TYPES = {
  knife: {
    name: 'Knife Goblin',
    hp: 3,
    attack: 2,
    defence: 1,
    icon: 'K',
    image: '/goblin.svg',
  },
  archer: {
    name: 'Archer Goblin',
    hp: 2,
    attack: 3,
    defence: 1,
    icon: 'A',
    image: '/goblin.svg',
  },
  spear: {
    name: 'Spear Goblin',
    hp: 4,
    attack: 3,
    defence: 2,
    icon: 'S',
    image: '/goblin.svg',
  },
  mage: {
    name: 'Mage Goblin',
    hp: 2,
    attack: 4,
    defence: 1,
    icon: 'M',
    image: '/goblin.svg',
  },
  king: {
    name: 'Goblin King',
    hp: 6,
    attack: 4,
    defence: 3,
    icon: 'G',
    image: '/goblin.svg',
  },
}

export function randomGoblinType(includeKing = false) {
  const keys = Object.keys(GOBLIN_TYPES).filter(k => includeKing || k !== 'king')
  const idx = Math.floor(Math.random() * keys.length)
  return keys[idx]
}
