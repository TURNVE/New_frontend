# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
project root 
ai-simulation-web/
│
├── public/
│
├── src/
│
├── tests/                   # E2E only (Playwright / Cypress)
│
├── .env.example
├── index.html
├── package.json
├── vite.config.ts           
├── vitest.config.ts
├── playwright.config.ts
└── README.md


src/
├── app/
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── router.tsx
│   └── router.test.tsx
│
├── pages/
│   ├── Landing/
│   │   ├── Landing.page.tsx
│   │   └── Landing.page.test.tsx
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.page.tsx
│   │   └── Dashboard.page.test.tsx
│   │
│   ├── Simulations/
│   │   ├── Simulations.page.tsx
│   │   └── Simulations.page.test.tsx
│   │
│   └── SimulationRoom/
│       ├── SimulationRoom.page.tsx
│       └── SimulationRoom.page.test.tsx
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── Modal.test.tsx
│   │   └── Loader/
│   │       ├── Loader.tsx
│   │       └── Loader.test.tsx
│   │
│   ├── layout/
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.test.tsx
│   │   └── Sidebar/
│   │       ├── Sidebar.tsx
│   │       └── Sidebar.test.tsx
│   │
│   └── simulation/
│       ├── SimulationCard/
│       │   ├── SimulationCard.tsx
│       │   └── SimulationCard.test.tsx
│       ├── SimulationProgress/
│       │   ├── SimulationProgress.tsx
│       │   └── SimulationProgress.test.tsx
│       └── SimulationChat/
│           ├── SimulationChat.tsx
│           └── SimulationChat.test.tsx
│
├── features/
│   ├── auth/
│   │   ├── auth.logic.ts
│   │   ├── auth.state.ts
│   │   └── auth.test.ts
│   │
│   ├── projects/
│   │   ├── project.logic.ts
│   │   ├── project.state.ts
│   │   └── project.test.ts
│   │
│   ├── simulations/
│   │   ├── simulation.logic.ts
│   │   ├── simulation.state.ts
│   │   └── simulation.test.ts
│   │
│   └── assessments/
│       ├── assessment.logic.ts
│       └── assessment.test.ts
│
├── hooks/
│   ├── useSimulation.ts
│   └── useSimulation.test.ts
│
├── services/
│   ├── apiClient.ts          # backend-agnostic HTTP layer
│   ├── simulation.mock.ts    # fake AI responses
│   └── apiClient.test.ts
│
├── store/
│   ├── index.ts
│   └── store.test.ts
│
├── utils/
│   ├── formatScore.ts
│   └── formatScore.test.ts
│
├── styles/
│   ├── globals.css
│   └── theme.css
│
└── test/
    ├── setup.ts
    ├── mocks/
    └── factories/

# Turnve_Frontend
