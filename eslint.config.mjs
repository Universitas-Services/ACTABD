// eslint.config.mjs

// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Configuración global
  {
    ignores: ['eslint.config.mjs', 'dist/', 'node_modules/'],
  },

  // Configuración base de ESLint
  eslint.configs.recommended,

  // Configuración ÚNICA y AVANZADA para todos los archivos TypeScript
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked], // Usamos solo la configuración que revisa tipos
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Aquí movemos las reglas específicas de TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Configuración de Prettier (debe ir al final)
  eslintPluginPrettierRecommended,

  // Configuración para globales (node, jest, etc.)
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
);
