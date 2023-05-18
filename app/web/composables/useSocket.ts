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

export const useGameSocket = () => {
    const gameSocket = useState<Socket | undefined>('gameSocket', undefined)

    const connectGameSocket = (): void => {
        gameSocket.value = io(`ws://${useRuntimeConfig().IP}/game`, {
            withCredentials: true,
            extraHeaders: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
            path: '/socket.io',
        })
    }

    const disconnectGameSocket = (): void => {
        gameSocket.value?.disconnect()
    }

    const reconnectGameSocket = (): void => {
        disconnectGameSocket()
        connectGameSocket()
    }

    return { gameSocket, connectGameSocket, disconnectGameSocket, reconnectGameSocket }
}

export const useFriendSocket = () => {
    const friendSocket = useState<Socket | undefined>('friendSocket', undefined)

    const connectFriendSocket = (): void => {
        friendSocket.value = io(`ws://${useRuntimeConfig().IP}/friend`, {
            withCredentials: true,
            extraHeaders: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
            path: '/socket.io',
        })
    }

    const disconnectFriendSocket = (): void => {
        friendSocket.value?.disconnect()
    }

    const reconnectFriendSocket = (): void => {
        disconnectFriendSocket()
        connectFriendSocket()
    }

    return { friendSocket, connectFriendSocket, disconnectFriendSocket, reconnectFriendSocket }
}

export const useSockets = () => {
    const { chatSocket, connectChatSocket, disconnectChatSocket, reconnectChatSocket } =
        useChatSocket()
    const { gameSocket, connectGameSocket, disconnectGameSocket, reconnectGameSocket } =
        useGameSocket()
    const { friendSocket, connectFriendSocket, disconnectFriendSocket, reconnectFriendSocket } =
        useFriendSocket()

    const connectSockets = () => {
        connectChatSocket()
        connectGameSocket()
        connectFriendSocket()
    }

    const disconnectSockets = () => {
        disconnectChatSocket()
        disconnectGameSocket()
        disconnectFriendSocket()
    }

    const reconnectSockets = () => {
        reconnectChatSocket()
        reconnectGameSocket()
        reconnectFriendSocket()
    }

    const logSocketExceptions = () => {
        chatSocket.value?.on('exception', err => {
            console.log(`${err}: ${err.message}`)
        })
        gameSocket.value?.on('exception', err => {
            console.log(`${err}: ${err.message}`)
        })
        friendSocket.value?.on('exception', err => {
            console.log(`${err}: ${err.message}`)
        })
    }
    
    const handleSocketDisconnection = () => {
        chatSocket.value?.on('disconnect', reason => {
            refreshAccessToken()
        })
        gameSocket.value?.on('disconnect', reason => {
            refreshAccessToken()
        })
        friendSocket.value?.on('disconnect', reason => {
            refreshAccessToken()
        })
    }

    return { connectSockets, handleSocketDisconnection, disconnectSockets, reconnectSockets, logSocketExceptions }
}
