
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

export function computeMonsterBreakdown(monster, roll = 0, extra = 0) {
  const attack = monster.attack
  const total = attack + roll + extra
  const type = monster.attackType || 'melee'
  return { total, attack, roll, extra, type }
}

export function computeCounterAttack(hero, weapon, monster, face, extraMod = 0) {
  const roll = typeof face === 'number' ? face : 0
  const breakdown = computeMonsterBreakdown(monster, roll, extraMod)
  const heroDefBefore = hero.defence + weapon.defence
  let heroDefAfter = hero.defence
  let shieldDamage = 0
  let damage = 0
  let brokeShield = false

  if (face === 'shieldBreak') {
    damage = breakdown.total
    heroDefAfter = 0
    brokeShield = true
  } else if (face !== 'torchDown') {
    shieldDamage = Math.min(breakdown.total, heroDefBefore)
    if (breakdown.total > heroDefBefore && heroDefBefore > 0) {
      brokeShield = true
      damage = breakdown.total - heroDefBefore
      heroDefAfter = 0
    } else if (heroDefBefore === 0) {
      damage = breakdown.total
    }
  }

  return {
    roll: typeof face === 'number' ? face : null,
    effect: face === 'shieldBreak' || face === 'torchDown' ? face : null,
    breakdown,
    damage,
    shieldDamage,
    brokeShield,
    defenceBefore: heroDefBefore,
    heroDefenceAfter: heroDefAfter,
  }
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

export function heroAttack(hero, goblin, weapon, rolls, baseIdx, extraIdxs = [], bonus = 0) {
  const details = computeAttackBreakdown(hero, weapon, rolls, baseIdx, extraIdxs, bonus)
  const attackPower = details.total
  const shieldDamage = Math.min(attackPower, goblin.defence)
  const brokeShield = attackPower > goblin.defence && goblin.defence > 0
  const heroDmg = brokeShield ? attackPower - goblin.defence : 0
  const defenceAfter = brokeShield ? 0 : goblin.defence
  const goblinHp = goblin.hp - heroDmg
  const message = brokeShield
    ? `Hero smashes the shield and deals ${heroDmg} damage.`
    : `The shield absorbs the blow.`

  return {
    hero,
    goblin: { ...goblin, hp: goblinHp },
    details,
    attackPower,
    shieldDamage,
    heroDmg,
    brokeShield,
    defenceAfter,
    message,
    heroDefenceAfter: hero.defence,
  }
}

export function chooseMonsterAttack(monster, distance = 0) {
  const attacks = monster.attacks || [
    { type: monster.attackType || 'melee', attack: monster.attack, range: monster.range }
  ]
  const usable = attacks.filter(a => {
    if (a.type === 'melee') return distance === 0
    return a.range != null && a.range >= distance
  })
  if (usable.length === 0) return null
  return usable.reduce((best, a) => (a.attack > best.attack ? a : best), usable[0])
}

export function monsterCounter(hero, weapon, goblin, distance = 0, aliveGoblins = 0) {
  const attack = chooseMonsterAttack(goblin, distance)
  if (!attack) return null
  const faces = ['torchDown', 2, 3, 4, 5, 'shieldBreak']
  const face = faces[Math.floor(Math.random() * faces.length)]
  const baseMod = goblin.extra || 0
  const bonus = ['knife', 'king'].includes(goblin.type) ? aliveGoblins : 0
  const extraMod = baseMod + bonus
  if (face === 'torchDown') {
    return { effect: 'torchDown' }
  }
  return computeCounterAttack(
    hero,
    weapon,
    { ...goblin, attack: attack.attack, attackType: attack.type },
    face,
    extraMod,
  )
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
  distance = 0,
) {
  const attack = heroAttack(hero, goblin, weapon, rolls, baseIdx, extraIdxs, bonus)

  let heroHp = hero.hp
  let heroDefenceAfter = hero.defence
  let message = attack.message
  let counter = null

  if (attack.goblin.hp > 0) {
    counter = monsterCounter(
      hero,
      weapon,
      { ...goblin, hp: attack.goblin.hp },
      distance,
      aliveGoblins,
    )
    if (counter && counter.effect !== 'torchDown') {
      heroHp -= counter.damage
      heroDefenceAfter = counter.heroDefenceAfter
      if (heroHp <= 0) {
        message += ' You have fallen.'
      }
    }
  } else {
    message += ' Goblin defeated!'
    if (heroHp <= 0) {
      message += ' You have fallen.'
    }
  }

  return {
    hero: { ...hero, hp: heroHp, defence: heroDefenceAfter },
    goblin: { ...goblin, hp: attack.goblin.hp },
    details: attack.details,
    attackPower: attack.attackPower,
    shieldDamage: attack.shieldDamage,
    heroDmg: attack.heroDmg,
    counter,
    brokeShield: attack.brokeShield,
    defenceAfter: attack.defenceAfter,
    heroDefenceAfter,
    message,
  }
}

export function formatFightLogs(result) {
  const {
    hero,
    goblin,
    details,
    attackPower,
    shieldDamage,
    heroDmg,
    counter,
    brokeShield,
    rolls,
    baseIdx,
    extraIdxs,
    weaponIdx,
    skillUsed,
  } = result
  const weapon = hero.weapons[weaponIdx]
  const logs = []
  logs.push(`Rolls: ${rolls.join(', ')}`)
  if (baseIdx != null) {
    const extras = extraIdxs.map(i => rolls[i]).join(', ')
    logs.push(`Using base ${rolls[baseIdx]}${extras ? ` with extras ${extras}` : ''}`)
  }
  const goblinDefBefore = goblin.defence
  const parts = []
  if (details.hero) {
    const label = skillUsed && hero.skill && hero.skill.title ? hero.skill.title : 'hero'
    parts.push(`${details.hero} ${label}`)
  }
  parts.push(`${details.weapon} weapon`)
  if (details.base) parts.push(`${details.base} base`)
  if (details.extra) parts.push(`${details.extra} extra`)
  logs.push(
    `Attack with ${weapon.name}: power ${attackPower} (${parts.join(' + ')}) vs defence ${goblinDefBefore}.`,
  )
  if (shieldDamage > 0) {
    logs.push(brokeShield ? `Shield takes ${shieldDamage} damage and breaks.` : `Shield takes ${shieldDamage} damage.`)
  } else {
    logs.push('The shield absorbs the blow.')
  }
  if (heroDmg > 0) logs.push(`Goblin loses ${heroDmg} HP.`)
  if (goblin.hp - heroDmg <= 0) logs.push('Goblin defeated!')
  if (counter) {
    if (counter.roll != null || counter.effect) {
      logs.push(`Goblin counter roll: ${counter.roll != null ? counter.roll : counter.effect}`)
    }
    if (counter.effect !== 'torchDown') {
      const bd = counter.breakdown
      const parts2 = [`${bd.attack} attack`]
      if (bd.roll) parts2.push(`${bd.roll} roll`)
      if (bd.extra) parts2.push(`${bd.extra} mod`)
      logs.push(`Counterattack power ${bd.total} (${parts2.join(' + ')}) vs defence ${counter.defenceBefore}.`)
      if (counter.effect === 'shieldBreak') {
        logs.push(`Shield break! You take ${counter.damage} damage.`)
      } else if (counter.brokeShield) {
        logs.push(`Shield broken! You take ${counter.damage} damage.`)
      } else if (counter.damage > 0) {
        logs.push(`You take ${counter.damage} damage.`)
      } else {
        logs.push('The shield absorbs the blow.')
      }
    } else {
      logs.push('Torch down! No counterattack.')
    }
  }
  return logs
}

export function formatFightMessage(result) {
  const { hero, goblin, heroDmg, counter, weaponIdx } = result
  const weapon = hero.weapons[weaponIdx]

  // If the hero dies, that message takes priority
  if (hero.hp <= 0) {
    return 'You have fallen.'
  }

  // Goblin defeated is the most exciting outcome
  if (goblin.hp <= 0) {
    return 'Goblin defeated!'
  }

  // Summarize the hero's strike briefly
  let msg = heroDmg > 0
    ? `You hit with your ${weapon.name} for ${heroDmg} damage.`
    : `Your ${weapon.name} fails to harm the goblin.`

  // Summarize counterattack, if any
  if (counter) {
    if (counter.effect === 'torchDown') {
      msg += ' The goblin fumbles its counter.'
    } else if (counter.damage > 0) {
      msg += ` The goblin strikes back for ${counter.damage} damage.`
    } else {
      msg += ' You block the counterattack.'
    }
  }

  return msg
}
