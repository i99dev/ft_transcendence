import { useToast } from 'primevue/usetoast'

export const useSockets = () => {
    const toast = useToast()
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
        logSocketExceptions()
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
    }
}
