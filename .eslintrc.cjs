module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['prettier'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'no-useless-constructor': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'prettier/prettier': ['error', { configFile: '.prettierrc.js' }],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-console': ['error', { allow: ['warn'] }],
  },
}
