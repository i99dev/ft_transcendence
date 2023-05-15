import { Socket } from 'socket.io-client'

export function useSocket() {
    const { gameSocket } = useGameSocket()
    const socket = ref(gameSocket.value as Socket | undefined)

    const gameWinner = ref('')
    const gameData = useState<gameStatusDto>('gameData', () => {
        return {} as gameStatusDto
    })
    const gameSetup = useState<SetupDto>('gameSetup', () => {
        return {} as SetupDto
    })

    const resetSocket = () => {
        socket.value?.off
        gameWinner.value = ''
    }

    const emitStartGame = (mode: GameSelectDto) => {
        socket.value?.emit('Join-Game', mode)
    }

    const emitLeaveQueue = () => {
        socket.value?.emit('Leave-Queue')
    }

    const setupSocketHandlers = () => {
        socket.value?.on('Game-Setup', (data: SetupDto) => {
            gameSetup.value = data
        })

        socket.value?.on('Game-Data', (data: gameStatusDto) => {
            gameData.value = data
        })

        socket.value?.on('Game-Over', payload => {
            gameWinner.value = payload.winner.username
        })
    }

    return {
        socket,
        emitStartGame,
        setupSocketHandlers,
        gameWinner,
        emitLeaveQueue,
        resetSocket,
    }
}

export function useTabEvent() {
    const showTab = ref(false)
    const { gameSocket } = useGameSocket()

    gameSocket.value?.on('Close-Tab', () => {
        showTab.value = true
    })
    useGameSocket()
    return { showTab }
}

export function useSound(playSoundCallback: (sound: string) => void) {
    const { gameSocket } = useGameSocket()

    gameSocket.value?.on('play-sound', (payload: string) => {
        playSoundCallback(payload)
    })

    return {}
}
