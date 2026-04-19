# Vue 3 + TypeScript + Vite

This template provides a minimal setup to get Vue 3 working in Vite with HMR and some ESLint rules.

Currently, the official Vue plugin is available:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) uses Vue 3 for HMR (Hot Module Replacement)

## Recommended IDE Support

We recommend using [VS Code](https://code.visualstudio.com/) with the [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension for the best Vue development experience.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      // Other configs...
      
      // Use recommended TypeScript configs
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,
      
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

## Features

This Vue 3 frontend includes:

- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for navigation
- **Pinia** for state management
- **TailwindCSS** for styling
- **Axios** for API requests