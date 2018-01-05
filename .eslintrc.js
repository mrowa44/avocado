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
    'import/no-extraneous-dependencies': 1, // can't build with it, electron has to be in dev
    'jsx-a11y/no-redundant-roles': 1,
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-for': 0,
  },
};
