import { io, Socket} from 'socket.io-client'

import { defineNuxtPlugin } from '#app'

const friendsSocket = ref({} as Socket)

export default defineNuxtPlugin((nuxtApp) => {
    friendsSocket.value = io('ws://localhost/friend', {
        withCredentials: true,
        extraHeaders: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        path: '/socket.io',
    })
    nuxtApp.friendsSocket = friendsSocket
})
