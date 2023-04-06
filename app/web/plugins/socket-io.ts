import io from 'socket.io-client'

import { defineNuxtPlugin } from '#app'

const socket = ref()

export default defineNuxtPlugin(nuxtApp => {
    socket.value = io('http://localhost/games', {
        withCredentials: true,
        extraHeaders: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        path: '/socket.io',
        transports: ['websocket'],
    })
    nuxtApp.socket = socket
})
