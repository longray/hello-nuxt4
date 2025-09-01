// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Nuxt4 大冒险',
      meta: [
        { name: 'author', content: '向阳与AI助手' }
      ]
    }
  },
  content: {},
  // extends: [
  //   '@nuxt/examples-ui',
  // ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/test-utils', '@nuxt/eslint', '@pinia/nuxt', '@nuxt/content']
})