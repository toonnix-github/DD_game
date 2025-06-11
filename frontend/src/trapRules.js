export const EVASION_RULE =
  "Roll your hero's agility dice. If the best result meets or exceeds the trap difficulty you avoid the damage.";

export const DISARM_RULE =
  "Spend 1 AP and roll your agility dice. If the best result meets or exceeds the trap difficulty the trap is disarmed and you gain the reward.";

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
