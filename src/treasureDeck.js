export const TreasureDeck = [
    { type: "armor", name: "Dragon-Scale Armor", id: "dragon-scale-armor", description: "Forged from scales of a mighty dragon, offers unparalleled protection.", defend: 8, effect: "Halves all fire damage taken.", rarity: "rare" },
    { type: "armor", name: "Golden Fleece", id: "golden-fleece", description: "Legendary fleece of a golden ram, shimmering with magical energy.", defend: 3, effect: "Guarantees at least rare item for next loot drop.", rarity: "legendary" },
    { type: "armor", name: "Helmet of Darkness", id: "helm-of-darkness", description: "Shrouds wearer in shadow, grants stealth and night vision.", defend: 2, effect: "Moves one extra space on turn.", rarity: "common" },
    { type: "armor", name: "Medusa Shield", id: "medusa-shield", description: "Shield bearing image of Medusa, petrifies attackers on successful defend.", defend: 5, effect: "Petrifies attacker for one turn on successful defend.", rarity: "rare" },
    { type: "armor", name: "Nemean Lion Pelt", id: "nemean-lion-pelt", description: "Impenetrable pelt of the Nemean Lion.", defend: 6, effect: "Gains +5 to strength checks and automatically wins one combat.", rarity: "legendary" },
    { type: "armor", name: "Tarnhelm", id: "tarnhelm", description: "Magical helm grants wearer invisibility and shape-shifting ability.", defend: 1, effect: "Teleports to any unoccupied space within 5 spaces.", rarity: "legendary" },
    { type: "rune", name: "Eye of Odin", id: "eye-of-odin", description: "Grants visions of the future and wisdom.", magicPower: 20, effect: "Look at top 3 cards of any deck.", rarity: "legendary" },
    { type: "rune", name: "Heart of Gaia", id: "heart-of-gaia", description: "Channels vital energy of the earth.", magicPower: 15, effect: "Restores 10 health points.", rarity: "rare" },
    { type: "rune", name: "Sigil of Loki", id: "sigil-of-loki", description: "Amplifies illusions and trickery.", magicPower: 18, effect: "Creates false obstacle to block enemies for one turn.", rarity: "rare" },
    { type: "rune", name: "Stone of Ra", id: "stone-of-ra", description: "Radiates warmth of the sun, enhances healing.", magicPower: 12, effect: "Heals user for 5 health points and all allies within 3 spaces for 2 health points.", rarity: "common" },
    { type: "rune", name: "Breath of Anubis", id: "breath-of-anubis", description: "Mastery over death and passage to afterlife.", magicPower: 16, effect: "Once per game, ignore a lethal attack.", rarity: "rare" },
    { type: "rune", name: "Philosopher Stone", id: "philosopher-stone", description: "Grants immortality, transmutes metals to gold.", magicPower: 25, effect: "Permanently adds +3 to strength and defense of a weapon.", rarity: "legendary" },
    { type: "rune", name: "Yata no Kagami", id: "yata-no-kagami", description: "Sacred mirror reflecting truth and inner self.", magicPower: 14, effect: "Clears skill check once.", rarity: "common" },
    { type: "rune", name: "Caduceus", id: "caduceus", description: "Symbolizes healing and mediation.", magicPower: 17, effect: "Prevents negative effects from next failed skill check.", rarity: "common" },
    { type: "rune", name: "Book of Thoth", id: "book-of-thoth", description: "Contains knowledge of the Egyptian gods.", magicPower: 22, effect: "Gain expertise in any one skill for rest of the game.", rarity: "legendary" },
    { type: "rune", name: "Gordian Knot", id: "gordian-knot", description: "Unbreakable bond representing an unsolvable problem.", magicPower: 10, effect: "Automatically succeed at one skill check.", rarity: "common" },
    { type: "weapon", name: "Excalibur", id: "excalibur", attack: { value: 3, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Deals double damage and ignores armor on a roll of 5.", rarity: "rare" },
    { type: "weapon", name: "Mjolnir", id: "mjolnir", attack: { value: 3, effect: "plus", element: "thunder", type: "melee", range: 0 }, skill: "Pushes target 2 spaces on hit, deals additional damage if they hit a wall.", rarity: "legendary" },
    { type: "weapon", name: "Aegis", id: "aegis", attack: { value: 1, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Stuns attacker for one turn on successful defend.", rarity: "legendary" },
    { type: "weapon", name: "Durandal", id: "durandal", attack: { value: 2, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Cannot be disarmed or broken by enemy attacks.", rarity: "rare" },
    { type: "weapon", name: "Masamune", id: "masamune", attack: { value: 3, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Performs two consecutive attacks with -3 penalty to each roll.", rarity: "legendary" },
    { type: "weapon", name: "Gungnir", id: "gungnir", attack: { value: 3, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Always succeeds in attack.", rarity: "legendary" },
    { type: "weapon", name: "Trident of Poseidon", id: "trident-of-poseidon", attack: { value: 3, effect: "plus", element: "water", type: "melee", range: 0 }, skill: "Gain +5 bonus to attack and defend in water terrains.", rarity: "rare" },
    { type: "weapon", name: "Fragarach", id: "fragarach", attack: { value: 2, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Forces monster to miss their next turn.", rarity: "legendary" },
    { type: "weapon", name: "Gae Bolg", id: "gae-bolg", attack: { value: 3, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Inflicts bleeding condition dealing 1 damage per turn.", rarity: "rare" },
    { type: "weapon", name: "Claws of Hades", id: "claws-of-hades", attack: { value: 2, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Drains life from target and heals user on successful attack.", rarity: "rare" },
    { type: "weapon", name: "Shadow Dagger", id: "shadow-dagger", attack: { value: 2, effect: "plus", element: "none", type: "melee", range: 0 }, skill: "Grants invisibility for one turn after attacking.", rarity: "rare" },
    { type: "weapon", name: "Earthshaker", id: "earthshaker", attack: { value: 3, effect: "plus", element: "earth", type: "melee", range: 0 }, skill: "Knocks down all enemies within one space of the target.", rarity: "legendary" },
    { type: "weapon", name: "Bow of Artemis", id: "bow-of-artemis", attack: { value: 2, effect: "minus", element: "poison", type: "range", range: 5 }, skill: "Ignores defense, chance to poison target.", rarity: "legendary" },
    { type: "weapon", name: "Stormcaller", id: "stormcaller", attack: { value: 3, effect: "plus", element: "thunder", type: "range", range: 6 }, skill: "Calls down lightning on the target, dealing area damage.", rarity: "legendary" },
    { type: "weapon", name: "Spectral Bow", id: "spectral-bow", attack: { value: 2, effect: "minus", element: "none", type: "range", range: 5 }, skill: "Arrows pass through obstacles, hitting enemies behind cover.", rarity: "legendary" },
    { type: "weapon", name: "Crossbow of the Undead", id: "crossbow-of-the-undead", attack: { value: 3, effect: "minus", element: "poison", type: "range", range: 5 }, skill: "Shoots bolts that poison and slow the target.", rarity: "rare" },
    { type: "weapon", name: "Lightning Bow", id: "lightning-bow", attack: { value: 2, effect: "minus", element: "thunder", type: "range", range: 5 }, skill: "Deals electric damage that jumps to nearby enemies.", rarity: "rare" },
    { type: "weapon", name: "Throwing Knives", id: "throwing-knives", attack: { value: 1, effect: "minus", element: "none", type: "range", range: 4 }, skill: "Can be thrown in quick succession.", rarity: "rare" },
    { type: "weapon", name: "Elven Bow", id: "elven-bow", attack: { value: 2, effect: "minus", element: "none", type: "range", range: 6 }, skill: "Shoots with great precision, ignoring cover.", rarity: "rare" },
    { type: "weapon", name: "Harp of Apollo", id: "harp-of-apollo", attack: { value: 1, effect: "minus", element: "none", type: "magic", range: 4 }, skill: "Charms a monster to skip its turn.", rarity: "rare" },
    { type: "weapon", name: "Staff of Asclepius", id: "staff-of-asclepius", attack: { value: 1, effect: "minus", element: "none", type: "magic", range: 3 }, skill: "Heals all allies within 3 spaces for 5 health points.", rarity: "rare" },
    { type: "weapon", name: "Frostbite Staff", id: "frostbite-staff", attack: { value: 2, effect: "minus", element: "water", type: "magic", range: 4 }, skill: "Freezes the target for one turn, preventing their action.", rarity: "rare" },
    { type: "weapon", name: "Phoenix Feather", id: "phoenix-feather", attack: { value: 1, effect: "minus", element: "none", type: "magic", range: 3 }, skill: "Revives the user with 5 health if they fall in battle.", rarity: "rare" },
    { type: "weapon", name: "Mystic Wand", id: "mystic-wand", attack: { value: 2, effect: "minus", element: "none", type: "magic", range: 4 }, skill: "Casts a random spell from a list of spells.", rarity: "rare" },
    { type: "weapon", name: "Flame Staff", id: "flame-staff", attack: { value: 3, effect: "plus", element: "fire", type: "magic", range: 5 }, skill: "Shoots a fireball that explodes on impact.", rarity: "legendary" },
    { type: "weapon", name: "Ice Wand", id: "ice-wand", attack: { value: 2, effect: "minus", element: "water", type: "magic", range: 4 }, skill: "Casts a ray of frost that slows and damages the target.", rarity: "rare" },
    { type: "weapon", name: "Thunder Staff", id: "thunder-staff", attack: { value: 3, effect: "plus", element: "thunder", type: "magic", range: 5 }, skill: "Summons a lightning bolt that deals heavy damage.", rarity: "legendary" }
]

export function randomTreasure() {
  const weapons = TreasureDeck.filter(it => it.type === 'weapon')
  const idx = Math.floor(Math.random() * weapons.length)
  return weapons[idx]
}

export function adaptTreasureItem(item) {
  const attackType = item.attack?.type || 'melee'
  let dice = 'strength'
  if (attackType === 'range') dice = 'agility'
  if (attackType === 'magic') dice = 'magic'
  return {
    name: item.name,
    attack: item.attack?.value || 0,
    defence: item.defend || 0,
    dice,
    image: `/weapon/${item.id}.webp`,
    attackType,
    range: item.attack?.range || 0,
  }
}
