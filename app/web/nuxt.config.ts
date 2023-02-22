import { useRuntimeConfig } from "#app";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_KEY: process.env.API_KEY,
      BACKEND_PORT: process.env.BACKEND_PORT,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
})
