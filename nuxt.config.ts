// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth', '@nuxthq/ui'],
  auth: {
    provider: {
      type: 'authjs',
    },
  },
  runtimeConfig: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NUXT_SECRET: process.env.NUXT_SECRET,
    public: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
  },
})
