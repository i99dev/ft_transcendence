import { Socket, io } from 'socket.io-client'

export const useChatSocket = () => {
    const chatSocket = useState<Socket | undefined>('chatSocket', undefined)

    const connectChatSocket = (): void => {
        chatSocket.value = io(`ws://${useRuntimeConfig().IP}/chat`, {
            withCredentials: true,
            extraHeaders: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
            path: '/socket.io',
        })
    }

    const disconnectChatSocket = (): void => {
        chatSocket.value?.disconnect()
    }

    const reconnectChatSocket = (): void => {
        disconnectChatSocket()
        connectChatSocket()
    }

    return { chatSocket, connectChatSocket, disconnectChatSocket, reconnectChatSocket }
}
