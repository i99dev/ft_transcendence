import { Socket, io } from 'socket.io-client'
import { useToast } from 'primevue/usetoast'

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
        // reconnectGameSocket()
        reconnectFriendSocket()
    }

    const updateSocketsToken = () => {
        chatSocket.value?.emit('Update-Token', useCookie('access_token').value)
        gameSocket.value?.emit('Update-Token', useCookie('access_token').value)
        friendSocket.value?.emit('Update-Token', useCookie('access_token').value)
    }

    const logSocketExceptions = () => {
        const toast = useToast()
        chatSocket.value?.on('exception', err => {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: err.message,
                life: 3000,
            })
        })
        gameSocket.value?.on('exception', err => {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: err.message,
                life: 3000,
            })
        })
        friendSocket.value?.on('exception', err => {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: err.message,
                life: 3000,
            })
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

    

    return {
        connectSockets,
        handleSocketDisconnection,
        disconnectSockets,
        reconnectSockets,
        logSocketExceptions,
        updateSocketsToken,
        areSocketsConnected,
    }
}

export const areSocketsConnected = () : boolean | undefined => {
    const { chatSocket } = useChatSocket()
    const { gameSocket } = useGameSocket()
    const { friendSocket } = useFriendSocket()

    return (
        chatSocket.value?.connected &&
        gameSocket.value?.connected &&
        friendSocket.value?.connected
    )
}
