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
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    css: ['@/assets/css/main.css'],
    plugins: ['~/plugins/socket-io.ts'],
})
