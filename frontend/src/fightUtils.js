
export function computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs = []) {
  const heroPart = hero.attack
  const weaponPart = weapon.attack
  let base = 0
  let extra = 0
  if (baseIdx != null && rolls[baseIdx] >= 3) {
    base = rolls[baseIdx]
    extraIdxs.forEach(idx => {
      if (idx !== baseIdx && rolls[idx] <= 2) extra += rolls[idx]
    })
  }
  const total = heroPart + weaponPart + base + extra
  return { total, hero: heroPart, weapon: weaponPart, base, extra }
}

export function computeAttackPower(hero, weapon, rolls, baseIdx, extraIdxs = []) {
  return computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs).total
}

export function computeUnusedRewards(rolls, baseIdx, extraIdxs = []) {
  let ap = 0
  let hp = 0
  rolls.forEach((v, idx) => {
    if (idx === baseIdx || extraIdxs.includes(idx)) return
    switch (v) {
      case 1:
        ap += 2
        break
      case 2:
        ap += 3
        break
      case 3:
      case 4:
        ap += 1
        break
      case 6:
        hp += 1
        break
      default:
        break
    }
  })
  return { ap, hp }
}

export function fightGoblin(hero, goblin, weapon, rolls, baseIdx, extraIdxs = []) {
  let heroHp = hero.hp
  let goblinHp = goblin.hp

  const details = computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs)
  const attackPower = details.total
  const heroDefence = hero.defence + weapon.defence
  const heroDmg = Math.max(1, attackPower - goblin.defence)
  const goblinDmg = Math.max(1, goblin.attack - heroDefence)

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
    details,
    attackPower,
    heroDmg,
    goblinDmg: goblinHp > 0 ? goblinDmg : 0,
    message,
  }
}
