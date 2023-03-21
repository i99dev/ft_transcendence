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
    css: [
        'primevue/resources/themes/saga-blue/theme.css',
        "primevue/resources/primevue.css",
        "primeicons/primeicons.css",
        'primeflex/primeflex.css'
    ],
    build: {
        transpile: ['primevue']
    },
    modules: ['@nuxtjs/tailwindcss'],
    // plugins: ['~/plugins/socket-io.ts'],
})
