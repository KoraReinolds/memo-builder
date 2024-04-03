// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    ['@nuxtjs/eslint-module', {}],
    '@nuxtjs/tailwindcss',
    'nuxt-vitest',
    '@pinia/nuxt',
  ],
  routeRules: {
    '/main/**': { ssr: false },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        return tag.includes('my-')
      },
    },
  },
})
