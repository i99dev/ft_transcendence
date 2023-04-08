import io from 'socket.io-client'

import { defineNuxtPlugin } from '#app'

const chatSocket = ref()

export default defineNuxtPlugin((nuxtApp) => {
    chatSocket.value = io('http://localhost/chat', {
        withCredentials: true,
        extraHeaders: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        path: '/socket.io',
    })
    nuxtApp.chatSocket = chatSocket
})
