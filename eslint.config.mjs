import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    '**/dist/',
    '**/build/',
    '**/.next/',
    '**/out/',
    '**/node_modules/',
    '**/.env*',
    '**/.DS_Store',
    '**/yarn.lock',
    '**/next.config.js',
    '**/plopfile.js',
    '**/postcss.config.js',
    '**/tailwind.config.js',
    '**/tsconfig.json',
    '**/eslint.config.js',
    '**/*.test.js',
    '**/*.spec.js',
    'graphql/**/*.js',
    'generated/**/*.js',
    '**/.plop/',
    '**/public/',
    '**/coverage/',
    '**/.cache/',
    'components/ui/',
    '**/components.json',
    '**/package.json',
    '**/package-lock.json',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'next/core-web-vitals',
      'plugin:prettier/recommended'
    ),

    plugins: {
      prettier,
      'unused-imports': unusedImports,
      react,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'react': {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'prettier/prettier': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'eqeqeq': 'warn',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1, 2, 100],
          ignoreArrayIndexes: true,
        },
      ],

      'prefer-const': 'warn',

      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],

          'newlines-between': 'always',

          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-duplicates': 'error',
      'no-empty-pattern': 'warn',
    },
  },
]);
