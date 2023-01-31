import { useRuntimeConfig } from "#app";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss'],
	runtimeConfig: {
		public: {
		  API_KEY: process.env.API_KEY,
		}
	  },
})
