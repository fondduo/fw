import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const flatCompat = new FlatCompat({
  baseDirectory: dirname,
  resolvePluginsRelativeTo: dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/parsers': {
        espree: ['.js', '.ts', '.cjs', '.mjs', '.jsx', '.tsx'],
      },
    },
  },
  ...fixupConfigRules(
    flatCompat.config({
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
      ],
      rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'import/export': 'off',
      },
    }),
  ),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
