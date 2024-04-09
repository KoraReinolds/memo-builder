// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    ['@nuxtjs/eslint-module', {}],
    'nuxt-vitest',
    '@pinia/nuxt',
    '@vueuse/nuxt',
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
