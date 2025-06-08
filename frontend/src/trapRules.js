export const DISARM_RULE =
  "Roll your hero's agility dice. Take the highest roll and add your agility stat. If the total meets or exceeds the trap difficulty, it is disarmed.";

export const TRAP_TYPES = {
  snare: {
    icon: '🪤',
    difficulty: 6,
    reward: 1,
    damage: 1,
  },
  spikes: {
    icon: '☠️',
    difficulty: 7,
    reward: 2,
    damage: 2,
  },
  flames: {
    icon: '🔥',
    difficulty: 8,
    reward: 3,
    damage: 3,
  },
  runes: {
    icon: '✨',
    difficulty: 9,
    reward: 4,
    damage: 4,
  },
}
