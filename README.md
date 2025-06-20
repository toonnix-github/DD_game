# DD_game

This project is a React and Vite implementation of the board game **Tiny Epic Dungeon**.

The hero selection screen displays colorful card‑style portraits for every hero type, letting you easily tell them apart.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
   You can verify the setup by running the linter:
   ```bash
   npm run lint
   ```
2. Run the included fight flow tests:
   ```bash
   npm test
   ```
3. Build the React app:
   ```bash
   npm run build
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

## Testing

Run all unit tests with:
```bash
npm test
```

## MVP Features
- Dungeon with a 7x7 grid of tiles.
- 70 prepared room tiles.
- Open new rooms only when a character moves to a connecting exit.
- Ten heroes: knight, elf, viking, sorceress, wizard, barbarian, rogue, paladin, cleric and ranger.
- Choose your hero at the start of the game.
- Characters have attributes:
  - Movement range
  - HP (capped by a max value)
  - Activity points
  - AP fully regenerates at the start of your turn
  - Defence power
  - Weapons determine attack power
  - One hero action available each turn, indicated by the action badge
- Fleeing now requires rolling agility dice, adding excitement to encounters.
- Monsters may counterattack. Damage equals the counter roll plus their attack
  and modifiers from special goblins and the number of goblins still alive.
- Revealing a monster for the first time deals 1 damage to the hero.
- Ranged and magic attacks respect line of sight and distance.
- Attacks now animate the target's shield shaking with the damage value popping
  out on a starburst background. Big hits can even shatter the shield in a
  burst of light, permanently removing its defence.
- Overflow damage now bursts from the target's hearts, and counterattacks show
  the same floating numbers when they hit the hero.
- Actions are recorded in an event log viewable from the **Dev** button, and the
  latest three entries are shown above the hero card as a narrative feed.
- Hovering a goblin token reveals its full card for quick reference.
- Goblin icons now appear in random corners of rooms with a slight tilt.

The hero panel now displays these attributes along with a portrait image for the selected hero. Lost HP is shown using the same heart icon tinted black via CSS so you can quickly gauge your health. Dice stats are represented by repeating dice icons rather than numbers.

### Trap Disarming

Stepping into a trapped room first requires an **evasion** roll. Roll your *agility* dice, choose one die of 3 or higher as your base and any dice showing 1–2 as add‑ons. If the total meets or exceeds the trap difficulty you take no damage and gain any unused‑dice rewards. Whether you succeed or not you may then spend **1 AP** to attempt a disarm check. Disarming works the same way: pick a base die of 3+ and add any 1–2 dice. Success disarms the trap for a random item and unused‑dice rewards; failure deals the trap damage again and leaves it active. Unresolved trap rooms are highlighted in red with a warning icon so you can easily spot them on the board.

### Customizing Hero Stats

Starting values for each hero type can be modified in
`src/heroData.js`. Edit the stats (including `maxHp` and weapon attack values)
there to tweak the characters without touching the game logic. Heroes no longer
have built-in attack or agility bonuses; their power comes solely from weapons
and dice rolls.

### Hero Skills

Each hero now has a unique skill defined in `src/heroData.js`. A skill
lists a title, a short description of how it works and the AP cost required to
use it. For example Freya's **Berserker Rage** spends 2 AP to grant +2
attack power for one fight.

### Developer Tools

Click the **Dev** button to open a modal showing the event log and a reset option.

### Torch Track

A horizontal torch bar below the dungeon board counts turns. The torch starts at
step 0 and drops one step every time you end your turn. A burning torch icon
marks the current position on the track. Reaching step 20 opens a Game Over
modal announcing defeat.
Each end turn logs a short message as the torch advances so you can follow the countdown in the narrative feed. When the torch reaches step 4 every discovered monster now advances one room at a time with a one second pause between each move. Every step is logged so you can track how the dungeon closes in around the hero.

### Styling with SCSS

Common card layouts now share a single SCSS mixin defined in
`src/styles/_card.scss`. Components such as `HeroPanel`, `GoblinCard` and
`ItemCard` include this mixin to keep their styles consistent. Vite compiles
these `.scss` files automatically during development and builds, so regular CSS
imports were replaced with SCSS equivalents. SCSS nesting keeps component styles
concise by grouping related selectors under the same parent.

### Artwork Credits

The colored knight and elf portraits shown in the game are custom SVG assets
created for this project. They replace the monochrome icons previously sourced
from the [Game Icons](https://game-icons.net/) project.
