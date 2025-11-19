module.exports = {
  env: {
    node: true,
    es2023: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off'
  }
}
