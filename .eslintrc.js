module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'prefer-promise-reject-errors': 'off',
    // TypeScript
    quotes: ['warn', 'single', { avoidEscape: true }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
