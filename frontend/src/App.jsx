import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import RoomTile from './components/RoomTile'
import Hero from './components/Hero'
import HeroPanel from './components/HeroPanel'
import ItemCard from './components/ItemCard'
import HeroSelect from './components/HeroSelect'
import EncounterModal from './components/EncounterModal'
import TrapModal from './components/TrapModal'
import { TRAP_TYPES } from './trapRules'
import DiscardModal from './components/DiscardModal'
import RewardModal from './components/RewardModal'
import EventLog from './components/EventLog'
import { createShuffledDeck } from './roomDeck'
import './App.css'
import { HERO_TYPES } from './heroData'
import { GOBLIN_TYPES, randomGoblinType } from './goblinData'
import { randomTreasure, adaptTreasureItem } from './treasureDeck'

const BOARD_SIZE = 7
const CENTER = Math.floor(BOARD_SIZE / 2)

const DIRS = ['up', 'down', 'left', 'right']

function directionFromDelta(dr, dc) {
  if (dr === -1) return 'up'
  if (dr === 1) return 'down'
  if (dc === -1) return 'left'
  if (dc === 1) return 'right'
  return null
}

function opposite(dir) {
  switch (dir) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    default:
      return null
  }
}


function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => ({
      row: r,
      col: c,
      roomId: null,
      revealed: false,
      paths: { up: false, down: false, left: false, right: false },
      goblin: null,
      effect: null,
    }))
  )
}

function loadState() {
  const saved = localStorage.getItem('dungeon-state')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.board) {
        parsed.board.forEach(row =>
          row.forEach(tile => {
            if (!tile.paths) tile.paths = { up: false, down: false, left: false, right: false }
            if (!('goblin' in tile)) tile.goblin = null
            if (!('trap' in tile)) tile.trap = null
            if (tile.trap && typeof tile.trap === 'string') {
              tile.trap = { ...TRAP_TYPES[tile.trap], id: tile.trap }
            }
            if (!('trapResolved' in tile)) tile.trapResolved = false
            if (!('effect' in tile)) tile.effect = null
          })
        )
      }
      if (parsed.hero) {
        const type = parsed.hero.type || 'knight'
        const base = HERO_TYPES[type]
        const maxHp = parsed.hero.maxHp ?? base.maxHp ?? base.hp
        const maxAp = parsed.hero.maxAp ?? base.maxAp ?? base.ap
        const skill = parsed.hero.skill ?? base.skill
        parsed.hero = {
          row: parsed.hero.row,
          col: parsed.hero.col,
          skill: typeof skill === 'object' ? { ...skill } : skill,
          movement: parsed.hero.movement ?? base.movement,
          icon: parsed.hero.icon ?? base.icon,
          hp: Math.min(parsed.hero.hp ?? base.hp, maxHp),
          maxHp,
          ap: Math.min(parsed.hero.ap ?? base.ap, maxAp),
          maxAp,
          defence: parsed.hero.defence ?? base.defence,
          strengthDice: parsed.hero.strengthDice ?? base.strengthDice,
          agilityDice: parsed.hero.agilityDice ?? base.agilityDice,
          magicDice: parsed.hero.magicDice ?? base.magicDice,
          weapons: parsed.hero.weapons ?? base.weapons.map(w => ({ ...w })),
          name: base.name,
          image: base.image,
          type,
          offset: parsed.hero.offset ?? { x: 0, y: 0 },
        }
      }
      parsed.encounter = null
      if (!parsed.trap) parsed.trap = null
      if (!parsed.discard) parsed.discard = null
      if (!parsed.reward || !parsed.reward.item) parsed.reward = null
      return parsed
    } catch {
      /* ignore corrupted save */
    }
  }
  const board = createEmptyBoard()
  board[CENTER][CENTER] = {
    row: CENTER,
    col: CENTER,
    roomId: 'Start',
    revealed: true,
    paths: { up: true, down: true, left: true, right: true },
    goblin: null,
    effect: null,
  }
  return {
    board,
    hero: null,
    deck: createShuffledDeck(),
    encounter: null,
    trap: null,
    discard: null,
    reward: null,
  }
}

function App() {
  const [state, setState] = useState(loadState)
  const [heroDamaged, setHeroDamaged] = useState(false)
  const [eventLog, setEventLog] = useState([])
  const prevHpRef = useRef(state.hero ? state.hero.hp : null)

  const addLog = useCallback(msg => {
    setEventLog(prev => [...prev, msg])
  }, [])

  const chooseHero = useCallback(
    type => {
      const base = HERO_TYPES[type]
      const skill = base.skill
    const hero = {
      row: CENTER,
      col: CENTER,
      name: base.name,
      skill: typeof skill === 'object' ? { ...skill } : skill,
      movement: base.movement,
      icon: base.icon,
      hp: base.hp,
      maxHp: base.maxHp ?? base.hp,
      ap: base.ap,
      maxAp: base.maxAp ?? base.ap,
      defence: base.defence,
      strengthDice: base.strengthDice,
      agilityDice: base.agilityDice,
      magicDice: base.magicDice,
      weapons: base.weapons.map(w => ({ ...w })),
      image: base.image,
      type,
      offset: {
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
      },
    }
    setState(prev => ({ ...prev, hero }))
    addLog(`${hero.name} enters the dungeon.`)
  }, [addLog])

  useEffect(() => {
    localStorage.setItem('dungeon-state', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!state.hero) return
    if (prevHpRef.current != null && state.hero.hp < prevHpRef.current) {
      setHeroDamaged(true)
      const t = setTimeout(() => setHeroDamaged(false), 300)
      prevHpRef.current = state.hero.hp
      return () => clearTimeout(t)
    }
    prevHpRef.current = state.hero.hp
  }, [state.hero])

  const endTurn = useCallback(() => {
    setState(prev => {
      if (!prev.hero) return prev
      const base = HERO_TYPES[prev.hero.type]
      return {
        ...prev,
        hero: {
          ...prev.hero,
          movement: base.movement,
          ap: prev.hero.maxAp,
        },
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    localStorage.removeItem('dungeon-state')
    setState(loadState())
    setEventLog([])
  }, [])

  const moveHero = useCallback(
    (r, c) => {
      const { hero, board, deck, encounter } = state
      if (!hero || hero.movement <= 0 || encounter) return
      const dr = r - hero.row
      const dc = c - hero.col
      if (Math.abs(dr) + Math.abs(dc) !== 1) return
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return

      const dir = directionFromDelta(dr, dc)
      const currentTile = board[hero.row][hero.col]
      if (!currentTile.paths[dir]) return

      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      let newDeck = deck
      const target = newBoard[r][c]
      if (!target.revealed) {
        const room = newDeck[0]
        const roomId = room.roomId
        newDeck = newDeck.slice(1)

        const incoming = opposite(dir)
        const paths = { ...room.paths }
        paths[incoming] = true

        let goblin = null
        if (room.goblin) {
          const typeKey = room.goblin === 'king' ? 'king' : randomGoblinType()
          goblin = { ...GOBLIN_TYPES[typeKey], type: typeKey }
        }

        newBoard[r][c] = {
          row: r,
          col: c,
          roomId,
          revealed: true,
          paths,
          goblin,
          trap: room.trap ? { ...TRAP_TYPES[room.trap], id: room.trap } : null,
          trapResolved: false,
          effect: null,
        }
      } else if (!target.paths[opposite(dir)]) {
        return
      }

      let newHero = {
        ...hero,
        row: r,
        col: c,
        movement: hero.movement - 1,
        offset: {
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
        },
      }

      let newEncounter = null
      let newTrap = null
      if (newBoard[r][c].goblin) {
        newHero.movement = 0
        newEncounter = {
          goblin: { ...newBoard[r][c].goblin },
          position: { row: r, col: c },
          prev: { row: hero.row, col: hero.col },
        }
      }

      if (newBoard[r][c].trap && !newBoard[r][c].trapResolved && !newEncounter) {
        newHero.movement = 0
        newTrap = { position: { row: r, col: c }, trap: newBoard[r][c].trap }
      }

      setState({ board: newBoard, hero: newHero, deck: newDeck, encounter: newEncounter, trap: newTrap })
      addLog(`${hero.name} moves ${dir}`)
      if (newEncounter) addLog(`Encountered ${newEncounter.goblin.name}`)
      if (newTrap) {
        const t = newTrap.trap
        addLog(`Found trap: ${t.id} (difficulty ${t.difficulty})`)
      }
    },
    [state, addLog]
  )

  const possibleMoves = useMemo(() => {
    const { hero, board, encounter } = state
    if (!hero || hero.movement <= 0 || encounter) return []
    const tile = board[hero.row][hero.col]
    const moves = []
    if (tile.paths.up && hero.row > 0) {
      const t = board[hero.row - 1][hero.col]
      if (!t.revealed || t.paths.down) moves.push({ row: hero.row - 1, col: hero.col })
    }
    if (tile.paths.down && hero.row < BOARD_SIZE - 1) {
      const t = board[hero.row + 1][hero.col]
      if (!t.revealed || t.paths.up) moves.push({ row: hero.row + 1, col: hero.col })
    }
    if (tile.paths.left && hero.col > 0) {
      const t = board[hero.row][hero.col - 1]
      if (!t.revealed || t.paths.right) moves.push({ row: hero.row, col: hero.col - 1 })
    }
    if (tile.paths.right && hero.col < BOARD_SIZE - 1) {
      const t = board[hero.row][hero.col + 1]
      if (!t.revealed || t.paths.left) moves.push({ row: hero.row, col: hero.col + 1 })
    }
    return moves
  }, [state])

  const goblinCount = useMemo(
    () =>
      state.board.reduce(
        (acc, row) =>
          acc + row.reduce((a, t) => a + (t.goblin && t.goblin.hp > 0 ? 1 : 0), 0),
        0,
      ),
    [state.board],
  )

  const applyDiceRewards = useCallback(rewards => {
    if (!rewards || (!rewards.ap && !rewards.hp)) return
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
  }, [])

  const handleFight = useCallback(fightResult => {
    const logs = []
    const rewardVals = fightResult?.rewards || { ap: 0, hp: 0 }
    setState(prev => {
      const { encounter, board, hero } = prev
      if (!encounter || !fightResult) return prev
      const { skillUsed } = fightResult
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
      if (skillUsed && hero.skill && hero.skill.cost) {
        newHero.ap = Math.max(0, newHero.ap - hero.skill.cost)
      }

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
        // end encounter after counterattack
        newEncounter = null
      }
      const updated = {
        ...prev,
        board: newBoard,
        hero: newHero,
        encounter: newEncounter,
        reward,
        discard,
      }
      return updated
    })
    // create log details after state update
    if (fightResult) {
      const { goblin, details, attackPower, shieldDamage, heroDmg, counter, brokeShield, rolls, baseIdx, extraIdxs } = fightResult
      const weapon = fightResult.hero.weapons[fightResult.weaponIdx]
      logs.push(`Rolls: ${rolls.join(', ')}`)
      if (baseIdx != null) {
        const extras = extraIdxs.map(i => rolls[i]).join(', ')
        logs.push(`Using base ${rolls[baseIdx]}${extras ? ` with extras ${extras}` : ''}`)
      }
      const goblinDefBefore = fightResult.defenceAfter + shieldDamage
      const parts = []
      if (details.hero) parts.push(`${details.hero} hero`)
      parts.push(`${details.weapon} weapon`)
      if (details.base) parts.push(`${details.base} base`)
      if (details.extra) parts.push(`${details.extra} extra`)
      logs.push(`Attack with ${weapon.name}: power ${attackPower} (${parts.join(' + ')}) vs defence ${goblinDefBefore}.`)
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
      }
      if (rewardVals.ap || rewardVals.hp) {
        const rewardParts = []
        if (rewardVals.ap) rewardParts.push(`${rewardVals.ap} ap`)
        if (rewardVals.hp) rewardParts.push(`${rewardVals.hp} hp`)
        logs.push(`Unused dice reward: ${rewardParts.join(' and ')}.`)
      }
    }
    logs.forEach(addLog)
  }, [addLog])

  const handleFlee = useCallback(success => {
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
        msg = 'Fled successfully.'
      } else {
        const damage = Math.max(1, encounter.goblin.attack - hero.defence)
        newHero.hp = hero.hp - damage
        msg = `Failed to flee and took ${damage} damage.`
      }
      return { ...prev, board: newBoard, hero: newHero, encounter: newEncounter }
    })
    addLog(msg)
  }, [addLog])

  const handleTrapResolve = useCallback(result => {
    if (!result) return
    const { success, rolls } = typeof result === 'object' ? result : { success: result, rolls: [] }
    let msg = ''
    setState(prev => {
      const { trap, board, hero } = prev
      if (!trap) return prev
      const newBoard = board.map(row => row.map(tile => ({ ...tile })))
      const tile = newBoard[trap.position.row][trap.position.col]
      tile.trapResolved = success
      let newHero = { ...hero, movement: 0, ap: 0 }
      let discard = null
      let reward = prev.reward
      if (success) {
        const item = adaptTreasureItem(randomTreasure())
        newHero.weapons = [...hero.weapons, item]
        newHero.hp = Math.min(hero.hp + tile.trap.reward, hero.maxHp)
        reward = { item, hp: tile.trap.reward }
        msg = `Disarmed trap and gained ${tile.trap.reward} hp.`
      }
      if (!success) {
        newHero.hp = hero.hp - tile.trap.damage
        msg = `Hit by trap for ${tile.trap.damage} damage.`
      }
      return { ...prev, board: newBoard, hero: newHero, trap: null, reward, discard }
    })
    const rollMsg = rolls && rolls.length
      ? `Rolled ${rolls.join(', ')} (best ${Math.max(...rolls)})`
      : ''
    addLog(
      rollMsg
        ? `${rollMsg}. ${msg}`
        : msg,
    )
  }, [addLog])

  const handleRewardConfirm = useCallback(() => {
    let msg = 'Collected reward'
    setState(prev => {
      if (!prev.reward) return prev
      let discard = null
      if (prev.hero.weapons.length > 2) {
        discard = { items: prev.hero.weapons }
      }
      return { ...prev, reward: null, discard }
    })
    addLog(msg)
  }, [addLog])

  const handleDiscardConfirm = useCallback(items => {
    setState(prev => ({ ...prev, hero: { ...prev.hero, weapons: items }, discard: null }))
    addLog('Chose items to keep')
  }, [addLog])

  useEffect(() => {
    if (!state.hero) return
    const handler = e => {
      if (state.encounter || state.trap || state.discard || state.reward) return
      const { row, col } = state.hero
      if (e.key === 'ArrowUp') moveHero(row - 1, col)
      if (e.key === 'ArrowDown') moveHero(row + 1, col)
      if (e.key === 'ArrowLeft') moveHero(row, col - 1)
      if (e.key === 'ArrowRight') moveHero(row, col + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.hero, state.encounter, state.trap, state.discard, state.reward, moveHero])

  if (!state.hero) {
    return <HeroSelect onSelect={chooseHero} />
  }

  return (
    <>
      <div className="main">
        <div className="board">
          {state.board.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const highlight = possibleMoves.some(p => p.row === rIdx && p.col === cIdx)
              const disabled = !highlight && (state.hero.row !== rIdx || state.hero.col !== cIdx)
              return (
                <RoomTile
                  key={`${rIdx}-${cIdx}`}
                  tile={tile}
                  highlight={highlight}
                  disabled={disabled}
                  onClick={() => moveHero(rIdx, cIdx)}
                />
              )
            })
          )}
          {state.hero && (
            <div
              className={`hero-overlay${heroDamaged ? ' shake' : ''}`}
              style={{
                transform: `translate(${state.hero.col * 100 + (state.hero.offset?.x ?? 0)}%, ${
                  state.hero.row * 100 + (state.hero.offset?.y ?? 0)
                }%)`,
              }}
            >
              <Hero hero={state.hero} damaged={heroDamaged} />
            </div>
          )}
        </div>
      <div className="side">
        <HeroPanel hero={state.hero} damaged={heroDamaged} />
        {state.hero && (
          <div className="hero-items">
            {state.hero.weapons.map((w, idx) => (
              <ItemCard key={idx} item={w} />
            ))}
          </div>
        )}
        <button onClick={endTurn} className="end-turn">End Turn</button>
        <button onClick={resetGame} className="reset-game">Reset Game</button>
        <EventLog log={eventLog} />
      </div>
      {state.encounter && (
        <EncounterModal
          goblin={state.encounter.goblin}
          hero={state.hero}
          goblinCount={goblinCount}
          onReward={applyDiceRewards}
          onFight={handleFight}
          onFlee={handleFlee}
        />
      )}
      {state.trap && (
        <TrapModal hero={state.hero} trap={state.trap.trap} onResolve={handleTrapResolve} />
      )}
      {state.reward && (
        <RewardModal reward={state.reward} onConfirm={handleRewardConfirm} />
      )}
      {state.discard && (
        <DiscardModal items={state.discard.items} onConfirm={handleDiscardConfirm} />
      )}
    </div>
  </>
)
}

export default App
