# DD_game

This project aims to build a digital adaptation of the board game **Tiny Epic Dungeon** using JavaScript and React.

The current version shows a hero portrait drawn in a Hearthstone‑style. Each hero now has unique artwork making it clear which character is a knight or an elf.

## Getting Started

1. Install dependencies (this also installs frontend packages):
   ```bash
   npm install
   ```
   You can verify the setup by running the linter:
   ```bash
   npm run lint --prefix frontend
   ```
2. Run the included fight flow tests:
   ```bash
   npm test
   ```
3. Build the React app:
   ```bash
   npm run build --prefix frontend
   ```
4. Start the server:
   ```bash
   npm start
   ```

5. Open `http://localhost:3000` in your browser.

## Testing

Run all unit tests with:
```bash
npm test
```

## MVP Features
- Dungeon with a 7x7 grid of tiles.
- 70 prepared room tiles.
- Open new rooms only when a character moves to a connecting exit.
- Three characters: knight, elf and viking.
- Choose your hero at the start of the game.
- Characters have attributes:
  - Movement range
  - HP (capped by a max value)
  - Activity points
  - AP fully regenerates at the start of your turn
  - Defence power
  - Weapons determine attack power
- Fleeing now requires rolling agility dice, adding excitement to encounters.
- Monsters may counterattack. Damage equals the counter roll plus their attack
  and modifiers from special goblins and the number of goblins still alive.
- Attacks now animate the target's shield shaking with the damage value popping
  out on a starburst background. Big hits can even shatter the shield in a
  burst of light, permanently removing its defence.
- Overflow damage now bursts from the target's hearts, and counterattacks show
  the same floating numbers when they hit the hero.

The hero panel now displays these attributes along with a portrait image for the selected hero. Lost HP is shown using the same heart icon tinted black via CSS so you can quickly gauge your health. Dice stats are represented by repeating dice icons rather than numbers.

### Trap Disarming

Stepping into a trapped room first requires an **evasion** roll. Roll your hero's *agility* dice and if the best result meets or exceeds the trap difficulty you avoid the initial damage. Whether you succeed or not you may then spend **1 AP** to attempt a disarm roll using the same difficulty. Success grants a random treasure and removes the trap, while failure deals the trap damage again and leaves it active. Unresolved trap rooms are highlighted in red with a warning icon so you can easily spot them on the board.

### Customizing Hero Stats

Starting values for each hero type can be modified in
`frontend/src/heroData.js`. Edit the stats (including `maxHp` and weapon attack
values) there to tweak the characters without touching the game logic. Heroes no
longer have built-in attack or agility bonuses; their power comes solely from
weapons and dice rolls.

### Hero Skills

Heroes may also possess special skills that consume action points. The first
implemented example is the Viking's **Berserker Rage**. When toggled before a
fight it spends 2 AP and grants +2 attack power for that encounter.

### Styling with SCSS

Common card layouts now share a single SCSS mixin defined in
`frontend/src/styles/_card.scss`. Components such as `HeroPanel`, `GoblinCard`
and `ItemCard` include this mixin to keep their styles consistent. Vite compiles
these `.scss` files automatically during development and builds, so regular CSS
imports were replaced with SCSS equivalents. SCSS nesting keeps component styles
concise by grouping related selectors under the same parent.

### Artwork Credits

The colored knight and elf portraits shown in the game are custom SVG assets
created for this project. They replace the monochrome icons previously sourced
from the [Game Icons](https://game-icons.net/) project.
