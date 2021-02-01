module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': [0, {
      'properties': 'always'
    }]
  },
  parserOptions: {
    'parser': 'babel-eslint',
    'ecmaVersion': 2018,
    'sourceType': 'module'
  }
}
