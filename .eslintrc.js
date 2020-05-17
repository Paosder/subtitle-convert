module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  parserOptions: {
    include: ['src/**/*.tsx', 'src/**/*.ts'],
    exclude: ['public/*', 'src/**/*.d.ts'],
  },
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.js', '.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
      alias: {
        map: [
          ['@common', './src/common'],
        ],
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-assertions': 0,
    '@typescript-eslint/no-angle-bracket-type-assertion': 0,
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/indent': ['error', 2],
    'no-param-reassign': 0,
    'max-classes-per-file': 0,
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'import/no-extraneous-dependencies': 0,
    'max-len': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
