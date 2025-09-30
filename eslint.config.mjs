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

  // Configuraciones base
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // Usamos la recomendada sin tipos primero

  // 👇 --- INICIO DE LA CORRECCIÓN --- 👇
  // Configuración específica para archivos TypeScript con reglas que requieren tipos
  {
    files: ['**/*.ts'], // Aplicamos esta sección solo a archivos .ts
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // Le indicamos explícitamente que busque el tsconfig.json más cercano
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 👆 --- FIN DE LA CORRECCIÓN --- 👆

  // Configuración de Prettier (debe ir al final)
  eslintPluginPrettierRecommended,

  // Reglas personalizadas y globales
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
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
);