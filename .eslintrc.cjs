module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['prettier'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': ['error', { configFile: '.prettierrc.js' }],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'prettier/prettier': 'off',
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: {
              max: 1,
            },
            multiline: {
              max: 1,
            },
          },
        ],
      },
    },
    // {
    //   files: ['**/*.vue'],
    //   rules: {
    //     'vue/max-attributes-per-line': [
    //       'error',
    //       {
    //         singleline: 1,
    //         multiline: {
    //           max: 1,
    //           allowFirstLine: false,
    //         },
    //       },
    //     ],
    //   },
    // },
  ],
}
