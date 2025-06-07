export function computeAttackPower(hero, rolls, baseIdx) {
  let power = hero.attack
  if (baseIdx != null && rolls[baseIdx] >= 3) {
    power += rolls[baseIdx]
    rolls.forEach((v, idx) => {
      if (idx !== baseIdx && v <= 2) power += v
    })
  }
  return power
}

export function fightGoblin(hero, goblin, rolls, baseIdx) {
  let heroHp = hero.hp
  let goblinHp = goblin.hp

  const attackPower = computeAttackPower(hero, rolls, baseIdx)
  const heroDmg = Math.max(1, attackPower - goblin.defence)
  const goblinDmg = Math.max(1, goblin.attack - hero.defence)

  goblinHp -= heroDmg
  let message = `Hero deals ${heroDmg} damage.`
  if (goblinHp > 0) {
    heroHp -= goblinDmg
    message += ` Goblin strikes back for ${goblinDmg}.`
  } else {
    message += ' Goblin defeated!'
  }
  if (heroHp <= 0) {
    message += ' You have fallen.'
  }

  return {
    hero: { ...hero, hp: heroHp },
    goblin: { ...goblin, hp: goblinHp },
    attackPower,
    heroDmg,
    goblinDmg: goblinHp > 0 ? goblinDmg : 0,
    message,
  }
}
