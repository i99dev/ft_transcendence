<template>
    <div class="no-context-menu">
        <GameStatusBar
            v-if="showStatusBar"
            @ExitBtn="$emit('ExitBtn')"
            :cooldown11="pu1Cooldowns[0]"
            :cooldown12="pu1Cooldowns[1]"
            :cooldown21="pu2Cooldowns[0]"
            :cooldown22="pu2Cooldowns[1]"
            @powerup="activatePowerUp($event)"
        />
        <GameReadyModal class="fixed z-20" v-if="showReadyModal" />
        <GameMobileControls
            v-if="isMobile"
            class="z-19"
            @touchStart="handleTouchStart"
            @touchEnd="handleTouchEnd"
        />
        <GameAnnouncments v-if="showAnnouncment" class="z-20" />
        <canvas
            ref="canvasRef"
            class="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style="width: 100%; height: 100%"
        ></canvas>
    </div>
</template>

<script lang="ts" setup>
import { useGameRenderer } from '~/composables/Game/useGameRenderer'

const { showAnnouncment, announcmentMessage, resetAnnouncment } = useGameAnnouncment()
let canvasRef = ref<HTMLCanvasElement>()
let gameSetup = useState<SetupDto>('gameSetup')
let gameData = useState<gameStatusDto>('gameData')
const pu1Cooldowns = ref([false, false])
const pu2Cooldowns = ref([false, false])
const showStatusBar = ref(false)
const showReadyModal = ref(false)
const zooming = ref(false)

const { init_game, updatePlayer, updateBall, rescaleGameData, resetCamera, zoomToArena, reset } =
    useGameRenderer()
const { socket, emitStartGame, setupSocketHandlers, resetSocket, gameWinner } = useGameSocketEvent()

const emit = defineEmits(['ReadyGame', 'GameOver', 'ExitBtn'])
defineExpose({ setup, giveUp, destroy })

const isMobile = useState<boolean>('isMobile')

const playSound = (sound: string): void => {
    const random = Math.floor(Math.random() * 2) + 1
    const audio = new Audio(`/sounds/${sound}-${random}.mp3`)
    audio.volume = 0.2
    audio.play()
}

useGameSound(playSound)

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
}

onMounted(() => {
    checkWinner()
    setupEvents()
})

onUnmounted(() => {
    giveUp()
    clearEvents()
    reset()
    zooming.value = false
    resetAnnouncment()
})

const checkWinner = () => {
    if (gameWinner.value) {
        emitGameOver(gameWinner.value)
        gameWinner.value = ''
    }
}

const setupEvents = (): void => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('popstate', handleArrows)
}

const clearEvents = (): void => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    window.removeEventListener('popstate', handleArrows)
}

const handleArrows = (e: PopStateEvent): void => {
    giveUp()
}

const emitGameOver = (winner: string): void => {
    if (winner == gameSetup.value?.game?.players[gameSetup.value?.player].login) {
        emit('GameOver', 'you won')
        const winSound = new Audio('/sounds/win.mp3')
        winSound.play()
    } else {
        emit('GameOver', 'you lost')
        const loseSound = new Audio('/sounds/lose.mp3')
        loseSound.play()
    }

    reset()
    showStatusBar.value = false
}

watchEffect(() => {
    if (gameWinner.value) {
        emitGameOver(gameWinner.value)
        gameWinner.value = ''
    }
})

function destroy(): void {
    resetSocket()
    reset()
}

function giveUp(): void {
    if (!gameSetup.value?.game) return
    socket.value?.emit('Give-Up', gameSetup.value?.game.players[gameSetup.value?.player])
    setTimeout(() => {
        gameWinner.value = ''
    }, 500)
    destroy()
}

function setup(mode: GameSelectDto): void {
    resetSocket()
    setupSocketHandlers()
    if (mode.gameMode != 'invite') emitStartGame(mode)
}

watch(gameSetup, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        if (showReadyModal.value || Object.keys(gameSetup).length === 0) return
        showReadyModal.value = true
        emit('ReadyGame')
        rescaleGameData(newVal.game)
        init_game(canvasRef as Ref<HTMLCanvasElement>)
    }
})

watch(gameData, (newVal, oldVal) => {
    showStatusBar.value = true
    if (newVal) {
        showReadyModal.value = false
        if (gameData.value?.countDown > 0) {
            if (!zooming.value) {
                zoomToArena()
                zooming.value = true
            }
            showAnnouncment.value = true
            announcmentMessage.value = (Math.floor(gameData.value?.countDown) + 1).toString()

            return
        }
        if (zooming.value) {
            showAnnouncment.value = false
            zooming.value = false
        }
        updatePaddleDirection()
        rescaleGameData(newVal)
        updatePlayer(gameData.value?.players)
        updateBall(gameData.value?.ball)
    }
})

const startPowerCooldown = (player: number, key: number): void => {
    if (player == 0) {
        if (pu1Cooldowns.value[key]) return
        pu1Cooldowns.value[key] = true
        setTimeout(() => {
            pu1Cooldowns.value[key] = false
        }, 5000)
    } else if (player == 1) {
        if (pu2Cooldowns.value[key]) return
        pu2Cooldowns.value[key] = true
        setTimeout(() => {
            pu2Cooldowns.value[key] = false
        }, 5000)
    }
}

const activatePowerUp = (key: any): void => {
    if (key == '1') {
        socket.value?.emit('Power-Up', 1)
        startPowerCooldown(gameSetup.value?.player, 0)
    } else if (key == '2') {
        socket.value?.emit('Power-Up', 2)
        startPowerCooldown(gameSetup.value?.player, 1)
    }
}

const handleKeyDown = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault()
    }
    if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        keys[event.key] = true
    } else if (event.key == '1' || event.key == '2' || event.key == '3' || event.key == '4') {
        activatePowerUp(event.key)
    } else if (event.code == 'Space') {
        resetCamera()
    }
}

const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault()
        keys[event.key] = false
    }
}

const handleTouchStart = (dir: string) => {
    if (dir == 'up') {
        keys.ArrowUp = true
    } else if (dir == 'down') {
        keys.ArrowDown = true
    }
}

const handleTouchEnd = (dir: string) => {
    if (dir == 'up') {
        keys.ArrowUp = false
    } else if (dir == 'down') {
        keys.ArrowDown = false
    }
}

const updatePaddleDirection = (): void => {
    if (keys.ArrowUp) {
        socket.value?.emit('move', 'up')
    } else if (keys.ArrowDown) {
        socket.value?.emit('move', 'down')
    }
}
</script>

<style>
.no-context-menu {
    user-select: none;
    -webkit-touch-callout: none;
}
</style>
