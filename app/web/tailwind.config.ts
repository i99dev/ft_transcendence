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
            height: {
                '5vh': '5vh',
                '10vh': '10vh',
                '20vh': '20vh',
                '30vh': '30vh',
                '40vh': '40vh',
                '50vh': '50vh',
                '60vh': '60vh',
                '70vh': '70vh',
                '80vh': '80vh',
                '90vh': '90vh',
            },
            maxHeight: {
                '5vh': '5vh',
                '10vh': '10vh',
                '15vh': '15vh',
                '20vh': '20vh',
                '30vh': '30vh',
                '40vh': '40vh',
                '50vh': '50vh',
                '60vh': '60vh',
                '70vh': '70vh',
                '80vh': '80vh',
                '90vh': '90vh',
            },
            screens: {
                mobile: { max: '640px', min: '320px' },
                tablet: { max: '1024px', min: '641px' },
                laptop: { max: '1280px', min: '1025px' },
                desktop: { max: '1920px', min: '1281px' },
                '4k': { max: '2560px', min: '1921px' },
            },
            scale: {
                '-100': '-1',
            },
            colors: {
                primary_light: '#f688c7',
                primary: '#E93CAC',
                primary_dark: '#cf65a4',
                secondary_light: '#671cb5',
                secondary: '#5603ad',
                secondary_dark: '#4d039c',
                tertiary_light: '#9bdcf0',
                tertiary: '#59CBE8',
                tertiary_dark: '#7cbdd0',
                background_light: '#2e3750',
                background: '#17213c',
                background_dark: '#121a30',
                accent_light: '#adebab',
                accent: '#7EE081',
                accent_dark: '#93d091',
            },
            borderWidth: {
                1: '1px',
            },
            fontSize: {
                '1/10': '10%',
                '1/5': '20%',
                '1/4': '25%',
                '1/3': '33.333333%',
                '1/2': '50%',
                '3/4': '75%',
                '5/6': '83.333333%',
                '7/8': '87.5%',
                '9/10': '90%',
            },
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
        },
    },
}
