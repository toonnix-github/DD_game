
export function computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs = [], bonus = 0) {
  const heroPart = bonus
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

export function computeAttackPower(hero, weapon, rolls, baseIdx, extraIdxs = [], bonus = 0) {
  return computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs, bonus).total
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

export function fightGoblin(
  hero,
  goblin,
  weapon,
  rolls,
  baseIdx,
  extraIdxs = [],
  bonus = 0,
  aliveGoblins = 0,
) {
  let heroHp = hero.hp
  let goblinHp = goblin.hp

  const details = computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs, bonus)
  const attackPower = details.total
  const heroDefence = hero.defence + weapon.defence
  // If the hero's attack power does not overcome the goblin's defence
  // they shouldn't inflict any damage. Previously a minimum of 1 damage
  // was always applied which could kill low HP goblins even when the
  // attack was too weak. This now properly allows zero damage.
  const heroDmg = Math.max(0, attackPower - goblin.defence)
  const goblinDmg = Math.max(1, goblin.attack - heroDefence)

  goblinHp -= heroDmg
  let message = `Hero deals ${heroDmg} damage.`
  if (goblinHp > 0) {
    heroHp -= goblinDmg
    message += ` Goblin strikes back for ${goblinDmg}.`
    let counter = null
    if (heroHp > 0) {
      const faces = ['torchDown', 2, 3, 4, 5, 'shieldBreak']
      const face = faces[Math.floor(Math.random() * faces.length)]
      const extraMod = (goblin.extra || 0) + aliveGoblins
      counter = {
        roll: typeof face === 'number' ? face : null,
        effect: face === 'shieldBreak' || face === 'torchDown' ? face : null,
        damage: 0,
      }
      if (typeof face === 'number') {
        counter.damage = face + goblin.attack + extraMod
        heroHp -= counter.damage
      } else if (face === 'shieldBreak') {
        counter.damage = goblin.attack + extraMod
        heroHp -= counter.damage
      }
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
      goblinDmg,
      counter,
      message,
    }
  } else {
    message += ' Goblin defeated!'
    if (heroHp <= 0) {
      message += ' You have fallen.'
    }
    return {
      hero: { ...hero, hp: heroHp },
      goblin: { ...goblin, hp: goblinHp },
      details,
      attackPower,
      heroDmg,
      goblinDmg: 0,
      counter: null,
      message,
    }
  }
}
