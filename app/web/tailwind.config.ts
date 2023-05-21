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
            scale: {
                '-100': '-1',
            },
            colors: {
                primary_light: '#f688c7',
                primary: '#E93CAC',
                primary_dark: '#cf65a4',
                secondary_light: '#adebab',
                secondary: '#7EE081',
                secondary_dark: '#93d091',
                tertiary_light: '#671cb5',
                tertiary: '#5603ad',
                tertiary_dark: '#4d039c',
                background_light: '#2e3750',
                background: '#17213c',
                background_dark: '#121a30',
                accent_light: '#9bdcf0',
                accent: '#59CBE8',
                accent_dark: '#7cbdd0',
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
