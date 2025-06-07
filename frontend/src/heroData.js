export const HERO_TYPES = {
  knight: {
    name: 'Knight',
    movement: 3,
    hp: 12,
    ap: 2,
    attack: 4,
    defence: 3,
    agility: 2,
    strengthDice: 3,
    agilityDice: 1,
    magicDice: 1,
    icon: 'K',
    image: '/knight.svg',
    weapons: [
      { name: 'Sword', attack: 2, defence: 0, dice: 'strength' },
      { name: 'Shield', attack: 1, defence: 2, dice: 'strength' },
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
    strengthDice: 2,
    agilityDice: 2,
    magicDice: 2,
    icon: 'E',
    image: '/elf.svg',
    weapons: [
      { name: 'Bow', attack: 2, defence: 0, dice: 'agility' },
      { name: 'Dagger', attack: 1, defence: 1, dice: 'agility' },
    ],
  },
}

