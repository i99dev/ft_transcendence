import { Socket } from 'socket.io-client'
import { useGameAnnouncment } from './useAnnouncment'

export function useSocket() {
    const { gameSocket } = useGameSocket()
    const { showAnnouncment, announcmentMessage } = useGameAnnouncment()
    const socket = ref(gameSocket.value as Socket | undefined)

    const gameWinner = useState<string>('gameWinner', () => '')
    const gameData = useState<gameStatusDto>('gameData', () => {
        return {} as gameStatusDto
    })
    const gameSetup = useState<SetupDto>('gameSetup', () => {
        return {} as SetupDto
    })

    const resetSocket = () => {
        socket.value?.off
        // gameWinner.value = ''
        // gameData.value = {} as gameStatusDto
        // gameSetup.value = {} as SetupDto
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
            showAnnouncment.value = true
            announcmentMessage.value = 'Deuce!'
            setTimeout(() => {
                showAnnouncment.value = false
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
    }
}

export function useDublicateModal() {
    const showDublicateModal = useState<boolean>('showDublicateModal', () => false)
    const { gameSocket } = useGameSocket()
    const isClientConnected = () => {
        return gameSocket.value?.connected
    }

    return { showDublicateModal, isClientConnected }
}

export function useSound(playSoundCallback: (sound: string) => void) {
    const { gameSocket } = useGameSocket()

    gameSocket.value?.on('play-sound', (payload: string) => {
        playSoundCallback(payload)
    })

    return {}
}
