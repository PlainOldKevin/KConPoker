# Poker Odds Calculator

A web app that lets users input hole cards and community cards in Texas Hold’em, and calculates win/tie/lose probabilities for each player.

## 🚀 Features

- Interactive UI to select cards from a standard 52-card deck
- Add/remove up to 8 players
- Input community cards (Flop, Turn, River)
- Calculate real-time win/tie odds using backend logic
- Responsive design for desktop

## 🛠️ Tech Stack

**Frontend:**

- React + TypeScript
- Axios

**Backend:**

- Node.js + Express
- `poker-odds-calc` package

**Other Tools:**

- Git + GitHub
- Vercel (frontend hosting)
- Render/Railway (backend API)

## 📸 Screenshots

_(Coming soon)_

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
