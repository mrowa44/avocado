module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    mocha: true,
    es6: true,
  },
  plugins: [
    'react',
    'jsx-a11y',
    'import'
  ],
  rules: {
    'react/prefer-stateless-function': 0,
    'react/jsx-filename-extension': 0,
  },
};
