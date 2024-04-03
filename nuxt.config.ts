// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    ['@nuxtjs/eslint-module', {}],
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
