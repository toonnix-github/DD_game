
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
  let heroDefenceAfter = hero.defence

  const details = computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs, bonus)
  const attackPower = details.total
  const heroDefence = hero.defence + weapon.defence
  const shieldDamage = Math.min(attackPower, goblin.defence)
  const brokeShield = attackPower > goblin.defence && goblin.defence > 0
  const heroDmg = brokeShield ? attackPower - goblin.defence : 0
  const defenceAfter = brokeShield ? 0 : goblin.defence
  const goblinDmg = Math.max(1, goblin.attack - heroDefence)

  goblinHp -= heroDmg
  let message = brokeShield
    ? `Hero smashes the shield and deals ${heroDmg} damage.`
    : `The shield absorbs the blow.`
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
        heroDefenceAfter = 0
      }
    }
    if (heroHp <= 0) {
      message += ' You have fallen.'
    }
    return {
      hero: { ...hero, hp: heroHp, defence: heroDefenceAfter },
      goblin: { ...goblin, hp: goblinHp },
      details,
      attackPower,
      shieldDamage,
      heroDmg,
      goblinDmg,
      counter,
      brokeShield,
      defenceAfter,
      heroDefenceAfter,
      message,
    }
  } else {
    message += ' Goblin defeated!'
    if (heroHp <= 0) {
      message += ' You have fallen.'
    }
    return {
      hero: { ...hero, hp: heroHp, defence: heroDefenceAfter },
      goblin: { ...goblin, hp: goblinHp },
      details,
      attackPower,
      shieldDamage,
      heroDmg,
      goblinDmg: 0,
      counter: null,
      brokeShield,
      defenceAfter,
      heroDefenceAfter,
      message,
    }
  }
}
