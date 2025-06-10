# Agent Instructions

This project is a Node.js and React implementation of a digital board game.

## Running the project

1. Install dependencies from the project root. This also installs the frontend packages:
   ```bash
   npm install
   ```
2. Run the React development server:
   ```bash
   npm run dev --prefix frontend
   ```
3. Build the frontend for production:
   ```bash
   npm run build --prefix frontend
   ```
4. Start the Express server:
   ```bash
   npm start
   ```

## Linting

Run ESLint against the frontend codebase:
```bash
npm run lint --prefix frontend
```

## General Guidelines

- Keep code style consistent with the existing codebase and use ESLint to catch issues.
- Place new frontend files under `frontend/src` and server code at the project root.
- Document significant features in `README.md` when needed.

