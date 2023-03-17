export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRET: process.env.CLIENT_SECRET,
            REDIRECT_URI: process.env.REDIRECT_URI,
            API_URL: process.env.API_URL,
        },
    },
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
    plugins: ['~/plugins/socket-io.ts'],
    imports: {
        dirs: ['./stores'],
    },

    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
    },
})
