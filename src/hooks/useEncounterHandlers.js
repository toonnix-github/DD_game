import { useCallback } from 'react'
import { adaptTreasureItem, randomTreasure } from '../treasureDeck'
import { formatFightLogs } from '../fightUtils'

export default function useEncounterHandlers(setState, addLog) {
  const applyDiceRewards = useCallback(
    rewards => {
      if (!rewards || (!rewards.ap && !rewards.hp)) return
      const rewardParts = []
      if (rewards.ap) rewardParts.push(`${rewards.ap} ap`)
      if (rewards.hp) rewardParts.push(`${rewards.hp} hp`)
      addLog(`The unused dice grant ${rewardParts.join(' and ')}.`)
      setState(prev => {
        const hero = prev.hero
        if (!hero) return prev
        const newHero = {
          ...hero,
          ap: Math.min(hero.ap + rewards.ap, hero.maxAp),
          hp: Math.min(hero.hp + rewards.hp, hero.maxHp),
        }
        return { ...prev, hero: newHero }
      })
    },
    [addLog, setState],
  )

  const applySkillCost = useCallback(
    (cost, title) => {
      if (!cost) return
      addLog(`${title} invoked, costing ${cost} AP.`)
      setState(prev => {
        const hero = prev.hero
        if (!hero) return prev
        return { ...prev, hero: { ...hero, ap: Math.max(0, hero.ap - cost) } }
      })
    },
    [addLog, setState],
  )

  const handleFight = useCallback(
    fightResult => {
      const logs = []
      setState(prev => {
        const { encounter, board } = prev
        if (!encounter || !fightResult) return prev
        const result = fightResult
        const newBoard = board.map(row => row.map(tile => ({ ...tile })))
        const tile = newBoard[encounter.position.row][encounter.position.col]
        let newEncounter = {
          ...encounter,
          goblin: { ...result.goblin, defence: result.defenceAfter },
        }
        let newHero = result.hero
        let discard = prev.discard
        let reward = prev.reward
        tile.goblin = { ...result.goblin, defence: result.defenceAfter }
        const row = encounter.position.row
        const col = encounter.position.col

        if (result.goblin.hp <= 0) {
          tile.goblin = null
          tile.effect = 'death'
          newEncounter = null
          const item = adaptTreasureItem(randomTreasure())
          newHero = { ...newHero, weapons: [...newHero.weapons, item] }
          reward = { item, hp: 0 }
          discard = null
          setTimeout(() => {
            setState(p => {
              const copy = p.board.map(r => r.map(t => ({ ...t })))
              const t = copy[row][col]
              if (t.effect === 'death') t.effect = null
              return { ...p, board: copy }
            })
          }, 600)
        } else if (result.counter) {
          newEncounter = null
        } else {
          newEncounter = null
        }
        const updated = {
          ...prev,
          board: newBoard,
          hero: newHero,
          encounter: newEncounter,
          reward,
          discard,
          discoveredGoblins:
            result.goblin.hp <= 0
              ? prev.discoveredGoblins.filter(g => g.row !== row || g.col !== col)
              : prev.discoveredGoblins,
        }
        return updated
      })
      if (fightResult) {
        formatFightLogs(fightResult).forEach(l => logs.push(l))
      }
      logs.forEach(addLog)
    },
    [addLog, setState],
  )

  const handleFlee = useCallback(
    success => {
      let msg = ''
      setState(prev => {
        if (!prev.encounter) return prev
        const { encounter, board, hero } = prev
        const newBoard = board.map(row => row.map(tile => ({ ...tile })))
        let newHero = { ...hero, movement: 0 }
        let newEncounter = encounter
        if (success) {
          newHero.row = encounter.prev.row
          newHero.col = encounter.prev.col
          newHero.offset = {
            x: Math.random() * 40 - 20,
            y: Math.random() * 40 - 20,
          }
          newEncounter = null
          msg = 'You escape into the corridor.'
        } else {
          const damage = Math.max(1, encounter.goblin.attack - hero.defence)
          newHero.hp = hero.hp - damage
          msg = `The goblin blocks your path, dealing ${damage} damage!`
        }
        return { ...prev, board: newBoard, hero: newHero, encounter: newEncounter }
      })
      addLog(msg)
    },
    [addLog, setState],
  )

  const handleTrapResolve = useCallback(
    result => {
      if (!result) return
      const {
        evaded,
        disarm,
        evasionRolls = [],
        disarmRolls = [],
        evasionRewards = { ap: 0, hp: 0 },
        rewards = { ap: 0, hp: 0 },
      } = result
      let messageParts = []
      setState(prev => {
        const { trap, board, hero } = prev
        if (!trap) return prev
        const newBoard = board.map(row => row.map(tile => ({ ...tile })))
        const tile = newBoard[trap.position.row][trap.position.col]
        let newHero = { ...hero }
        let reward = prev.reward
        let discard = null
        if (!evaded) {
          newHero.hp = hero.hp - tile.trap.damage
          messageParts.push(`The trap snaps shut, dealing ${tile.trap.damage} damage!`)
        } else {
          newHero.ap = Math.min(hero.ap + evasionRewards.ap, hero.maxAp)
          newHero.hp = Math.min(newHero.hp + evasionRewards.hp, hero.maxHp)
          const rParts = []
          if (evasionRewards.ap) rParts.push(`${evasionRewards.ap} ap`)
          if (evasionRewards.hp) rParts.push(`${evasionRewards.hp} hp`)
          messageParts.push(
            rParts.length
              ? `You deftly evade the trap and gain ${rParts.join(' and ')}.`
              : 'You nimbly evade the trap.',
          )
        }
        if (disarm !== undefined) {
          newHero.ap = Math.max(0, Math.min(hero.maxAp, newHero.ap - 1 + (disarm ? rewards.ap : 0)))
          if (disarm) {
            tile.trapResolved = true
            const item = adaptTreasureItem(randomTreasure())
            newHero.weapons = [...hero.weapons, item]
            newHero.hp = Math.min(newHero.hp + tile.trap.reward + (rewards.hp || 0), hero.maxHp)
            reward = { item, hp: tile.trap.reward + (rewards.hp || 0), ap: rewards.ap }
            const rewardMsg = []
            if (tile.trap.reward) rewardMsg.push(`${tile.trap.reward} hp`)
            if (rewards.ap) rewardMsg.push(`${rewards.ap} ap`)
            if (rewards.hp) rewardMsg.push(`${rewards.hp} bonus hp`)
            messageParts.push(`You disarm the trap and gain ${rewardMsg.join(' and ')}.`)
          } else {
            newHero.hp = newHero.hp - tile.trap.damage
            messageParts.push(`You fail to disarm it and suffer ${tile.trap.damage} damage!`)
          }
        }
        return { ...prev, board: newBoard, hero: newHero, trap: null, reward, discard }
      })
      const rollParts = []
      if (evasionRolls.length) rollParts.push(`Evade roll ${evasionRolls.join(', ')} (best ${Math.max(...evasionRolls)})`)
      if (disarmRolls.length) rollParts.push(`Disarm roll ${disarmRolls.join(', ')} (best ${Math.max(...disarmRolls)})`)
      const rollMsg = rollParts.join('. ')
      const msg = messageParts.join(' ')
      addLog(rollMsg ? `${rollMsg}. ${msg}` : msg)
    },
    [addLog, setState],
  )

  const handleRewardConfirm = useCallback(
    () => {
      let msg = 'You gather the spoils.'
      setState(prev => {
        if (!prev.reward) return prev
        let discard = null
        if (prev.hero.weapons.length > 2) {
          discard = { items: prev.hero.weapons }
        }
        return { ...prev, reward: null, discard }
      })
      addLog(msg)
    },
    [addLog, setState],
  )

  const handleDiscardConfirm = useCallback(
    items => {
      setState(prev => ({ ...prev, hero: { ...prev.hero, weapons: items }, discard: null }))
      addLog('You decide which gear to keep.')
    },
    [addLog, setState],
  )

  return {
    applyDiceRewards,
    applySkillCost,
    handleFight,
    handleFlee,
    handleTrapResolve,
    handleRewardConfirm,
    handleDiscardConfirm,
  }
}
