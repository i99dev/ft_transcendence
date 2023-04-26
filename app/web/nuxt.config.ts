export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        public: {
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRET: process.env.CLIENT_SECRET,
            REDIRECT_URI: process.env.REDIRECT_URI,
            API_URL: process.env.API_URL,
        },
    },
    css: ['~/assets/css/main.css'],
    build: {
        transpile: ['primevue'],
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: ['@nuxtjs/tailwindcss'],
    plugins: ['~/plugins/socket-io.ts','~/plugins/chat-socket.ts'],
})
