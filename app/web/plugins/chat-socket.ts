import { io, Socket } from 'socket.io-client'

import { defineNuxtPlugin } from '#app'

const chatSocket = ref({} as Socket)

export default defineNuxtPlugin(nuxtApp => {
    chatSocket.value = io('ws://localhost/chat', {
        withCredentials: true,
        extraHeaders: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        path: '/socket.io',
    })
    nuxtApp.chatSocket = chatSocket
})
