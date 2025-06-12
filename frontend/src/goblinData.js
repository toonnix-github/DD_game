export const GOBLIN_TYPES = {
  knife: {
    name: 'Knife Goblin',
    hp: 1,
    attack: 1,
    attackType: 'melee',
    extra: 1,
    defence: 5,
    icon: 'K',
    image: '/goblin/stabby-goblin.webp',
  },
  archer: {
    name: 'Archer Goblin',
    hp: 1,
    attack: 2,
    attackType: 'range',
    range: 3,
    defence: 7,
    icon: 'A',
    image: '/goblin/shooty-goblin.webp',
  },
  mage: {
    name: 'Mage Goblin',
    hp: 1,
    attack: 6,
    attackType: 'magic',
    range: 5,
    defence: 4,
    icon: 'M',
    image: '/goblin/shaman-goblin.webp',
  },
  king: {
    name: 'Goblin King',
    hp: 1,
    attack: 5,
    attackType: 'melee',
    extra: 2,
    defence: 10,
    icon: 'G',
    image: '/goblin/boss-goblin.webp',
  },
};

export function randomGoblinType(includeKing = false) {
  const keys = Object.keys(GOBLIN_TYPES).filter(k => includeKing || k !== 'king');
  const idx = Math.floor(Math.random() * keys.length);
  return keys[idx];
}
