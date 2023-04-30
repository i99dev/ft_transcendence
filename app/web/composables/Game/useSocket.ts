import { Socket } from 'socket.io-client'
import { inject } from 'vue'

export function useSocket(gameOverCallback: (winner: string) => void) {
    const nuxtApp = useNuxtApp()
export function useSocket() {
    const socket = ref(nuxtApp.socket as Socket)

    const gameData = useState<gameStatusDto>('gameData', () => { return {} as gameStatusDto })
    const gameSetup = useState<SetupDto>('gameSetup', () => { return {} as SetupDto })
    const resetSocket = () => {
        socket.value.off
    }

    const emitStartGame = (mode: GameSelectDto) => {
        socket.value.emit('Join-Game', mode)
    }

    const emitLeaveQueue = () => {
        socket.value.emit('Leave-Queue')
    }

    const setupSocketHandlers = () => {
        socket.value.on('Game-Setup', (data: SetupDto) => {
            gameSetup.value = data

        })

        socket.value.on('Game-Data', (data: gameStatusDto) => {
            gameData.value = data

        })

        socket.value.on('Game-Over', payload => {
            gameOverCallback(payload.winner.username)
        })
    }

    return {
        socket,
        emitStartGame,
        setupSocketHandlers,
        emitLeaveQueue,
        resetSocket
    }

export function useTabEvent() {
    const showTab = ref(false)
    const socket = ref(nuxtApp.socket as Socket)
    
    socket.value.on('Close-Tab', () => {
        console.log("Close TAB RECIVED !")
        showTab.value = true
    })

    return { showTab }
}

