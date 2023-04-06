import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            screens: {
                mobile: { max: '640px', min: '320px' },
                tablet: { max: '1024px', min: '641px' },
                laptop: { max: '1280px', min: '1025px' },
                desktop: { max: '1920px', min: '1281px' },
                '4k': { max: '2560px', min: '1921px' },
            },
        },
    },
}
