module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    'import/named': 'off',
    'import/no-duplicates': 'off',
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['css'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'import/order': 'off',
    'import/no-self-import': 'off',
    'import/no-cycle': 'off',
    'import/no-useless-path-segments': 'off',
    'import/no-relative-packages': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/export': 'warn',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
