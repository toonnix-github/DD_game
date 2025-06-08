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
2. Build the React app:
   ```bash
   npm run build --prefix frontend
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

## MVP Features
- Dungeon with a 7x7 grid of tiles.
- 70 prepared room tiles.
- Open new rooms only when a character moves to a connecting exit.
- Two characters: knight and elf.
- Choose your hero at the start of the game.
- Characters have attributes:
  - Movement range
  - HP
  - Activity points
- Attack power
- Defence power
- Fleeing now requires rolling agility dice, adding excitement to encounters.

The hero panel now displays these attributes along with a portrait image for the selected hero.

### Trap Disarming

When you enter a room with a trap you may attempt to disarm it. Roll your hero's
*agility* dice (shown in the hero panel). If any die comes up **4** or higher the
trap is disarmed and you receive a random treasure. Failure removes the trap but
grants no reward, so knowing your agility dice helps decide whether to disarm or
move on. Unresolved trap rooms are highlighted in red with a warning icon so you
can easily spot them on the board.

### Customizing Hero Stats

Starting values for each hero type can be modified in
`frontend/src/heroData.js`. Edit the stats there to tweak the characters
without touching the game logic.

### Artwork Credits

The colored knight and elf portraits shown in the game are custom SVG assets
created for this project. They replace the monochrome icons previously sourced
from the [Game Icons](https://game-icons.net/) project.
