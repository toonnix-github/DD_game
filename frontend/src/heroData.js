export const HERO_TYPES = {
  knight: {
    name: 'Knight',
    movement: 3,
    hp: 12,
    ap: 2,
    attack: 4,
    defence: 3,
    agility: 2,
    fightDice: 3,
    fleeDice: 1,
    icon: 'K',
    image: '/knight.svg',
    weapons: [
      { name: 'Sword', attack: 2, defence: 0 },
      { name: 'Shield', attack: 1, defence: 2 },
    ],
  },
  elf: {
    name: 'Elf',
    movement: 4,
    hp: 8,
    ap: 3,
    attack: 3,
    defence: 1,
    agility: 4,
    fightDice: 2,
    fleeDice: 2,
    icon: 'E',
    image: '/elf.svg',
    weapons: [
      { name: 'Bow', attack: 2, defence: 0 },
      { name: 'Dagger', attack: 1, defence: 1 },
    ],
  },
}

