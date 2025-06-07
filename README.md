# DD_game

This project aims to build a digital adaptation of the board game **Tiny Epic Dungeon** using JavaScript and React.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
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
- 60 prepared room tiles.
- Open new rooms only when a character moves to a connecting exit.
- Two characters: knight and archer.
- Characters have attributes:
  - Movement range
  - HP
  - Activity points
  - Attack power
  - Defence power
