import fondduoConfig from '@fondduo/eslint-config';

export default [
  {
    ignores: [
      '.idea',
      '.vscode',
      '**/dist/',
      '**/lib/',
      '**/node_modules/**',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/**/tsconfig.json',
          './config/**/tsconfig.json',
        ],
      },
    },
  },
  ...fondduoConfig,
];
