import { Socket, io } from 'socket.io-client'

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
