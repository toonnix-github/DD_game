export const EVASION_RULE =
  "Roll your agility dice then pick a die of 3+ as the base and any 1-2 dice as add-ons. If the total meets the trap difficulty you evade.";

export const DISARM_RULE =
  "Spend 1 AP and roll your agility dice. Choose a die of 3+ as the base and any 1-2 dice as add-ons. If the total meets or exceeds the trap difficulty the trap is disarmed and you gain the reward.";

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
