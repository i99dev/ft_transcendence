import { Socket } from 'socket.io-client'

export function useGameSocketEvent() {
    const { gameSocket } = useGameSocket()
    const socket = ref(gameSocket.value as Socket | undefined)

    const gameWinner = useState<string>('gameWinner', () => '')
    const gameData = useState<gameStatusDto>('gameData', () => {
        return {} as gameStatusDto
    })
    const gameSetup = useState<SetupDto>('gameSetup', () => {
        return {} as SetupDto
    })
    const isDeuce = useState<boolean>('isDeuce', () => {
        return false
    })

    const resetSocket = () => {
        socket.value?.off
    }

    const emitStartGame = (mode: GameSelectDto) => {
        socket.value?.emit('Join-Game', JSON.stringify(mode))
    }

    const emitLeaveQueue = () => {
        socket.value?.emit('Leave-Queue')
    }

    const emitReady = () => {
        socket.value?.emit('Ready')
    }

    const setupSocketHandlers = () => {
        socket.value?.on('Game-Over', payload => {
            gameWinner.value = payload.winner.login
        })

        socket.value?.on('Game-Setup', (data: SetupDto) => {
            gameSetup.value = data
        })

        socket.value?.on('Game-Data', (data: gameStatusDto) => {
            gameData.value = data
        })

        socket.value?.on('Game-Deuce', () => {
            isDeuce.value = true
            setTimeout(() => {
                isDeuce.value = false
            }, 3000)
        })
    }

    return {
        socket,
        emitStartGame,
        setupSocketHandlers,
        gameWinner,
        emitLeaveQueue,
        resetSocket,
        emitReady,
        isDeuce,
    }
}
