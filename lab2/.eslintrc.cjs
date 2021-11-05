module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'plugin:sonarjs/recommended'],
  plugins: ['prettier', 'sonarjs'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
