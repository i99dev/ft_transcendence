<template>
    <div>
        <GameStatusBar
            v-if="showStatusBar"
            @ExitBtn="$emit('ExitBtn')"
            :cooldown11="pu1Cooldowns[0]"
            :cooldown12="pu1Cooldowns[1]"
            :cooldown21="pu2Cooldowns[0]"
            :cooldown22="pu2Cooldowns[1]"
            @powerup="activatePowerUp($event)"
        />
        <GameReadyModal v-if="showReadyModal" />
        <GameMobileControls class="z-20" @touchDown=""></GameMobileControls>
        <canvas ref="canvasRef" class="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" style="width: 100%; height: 100%"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { useSocket, useSound } from '~/composables/Game/useSocket'
import { useGameRenderer } from '~/composables/Game/useGameRenderer'

let canvasRef = ref<HTMLCanvasElement>()
let gameSetup = useState<SetupDto>('gameSetup')
let gameData = useState<gameStatusDto>('gameData')
let touchStartY = ref(0)
let touchEndY = ref(0)




const pu1Cooldowns = ref([false, false])
const pu2Cooldowns = ref([false, false])
const showStatusBar = ref(false)
const showReadyModal = ref(false)

const { init_game, updatePlayer, updateBall, rescaleGameData, reset } = useGameRenderer()
const { socket, emitStartGame, setupSocketHandlers, gameWinner, resetSocket, emitReady } =
    useSocket()

const emit = defineEmits(['ReadyGame', 'GameOver', 'ExitBtn'])
defineExpose({ setup, giveUp, destroy })

const playSound = (sound: string): void => {
    const random = Math.floor(Math.random() * 2) + 1
    const audio = new Audio(`/sounds/${sound}-${random}.mp3`)
    audio.volume = 0.2
    audio.play()
}

useSound(playSound)

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
}

onMounted(() => {
    setupEvents()
})

onUnmounted(() => {
    giveUp()
    clearEvents()
    reset()
})

const setupEvents = (): void => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('popstate', handleArrows)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
}

const clearEvents = (): void => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    window.removeEventListener('popstate', handleArrows)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
}

const handleArrows = (e: PopStateEvent): void => {
    giveUp()
}

const emitGameOver = (winner: string): void => {
    if (winner == gameSetup.value?.game.players[gameSetup.value?.player].username) {
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

watch(gameWinner, (newVal, oldVal) => {
    if (newVal) {
        emitGameOver(newVal)
    }
})

function destroy(): void {
    resetSocket()
    reset()
}

function giveUp(): void {
    socket.value?.emit('Give-Up', gameSetup.value?.game.players[gameSetup.value?.player])
    destroy()
}

function setup(mode: GameSelectDto): void {
    resetSocket()
    if (mode.gameMode != 'invite') emitStartGame(mode)
    setupSocketHandlers()
}

watch(gameSetup, (newVal, oldVal) => {
    if (newVal.game != oldVal.game) {
        showReadyModal.value = true
        emit('ReadyGame')
        rescaleGameData(newVal.game)
        init_game(canvasRef as Ref<HTMLCanvasElement>)
    }
    showStatusBar.value = true
})

watch(gameData, (newVal, oldVal) => {
    if (newVal) {
        showReadyModal.value = false
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
    console.log('activatePowerup ', key)
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
    }
}

const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault()
        keys[event.key] = false
    }
}

const handleTouchUp = (dir: string) =>
{
    if(dir == 'up')
        keys['ArrowUp'] = false
    else if(dir == 'down')
        keys['ArrowDown'] = false

}

const handleTouchDown = (dir: string) =>
{
    if(dir == 'up')
        keys['ArrowUp'] = true
    else if(dir == 'down')
        keys['ArrowDown'] = true

}

const handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault()
    touchEndY.value = event.changedTouches[0].clientY

    if (touchEndY.value < touchStartY.value) {
        socket.value?.emit('move', 'up')
    }
    if (touchEndY.value > touchStartY.value) {
        socket.value?.emit('move', 'down')
    }
}

const handleTouchStart = (event: TouchEvent): void => {
    // event.preventDefault()
    touchStartY.value = event.touches[0].clientY
}

const handleTouchEnd = (): void => {
    touchStartY.value = 0
    touchEndY.value = 0
}

// const isMoveEventThrottled = ref(false);

// const throttleMoveEvent = (playerID: string, direction: string) => {
//     if (!isMoveEventThrottled.value) {
//         isMoveEventThrottled.value = true;
//         socket.value?.emit('move', 'up')
//         setTimeout(() => {
//             isMoveEventThrottled.value = false;
//         }, 1000 / 60); // throttle events at 60 FPS
//     }
// }

const updatePaddleDirection = (): void => {
    if (keys.ArrowUp) {
        socket.value?.emit('move', 'up')
    } else if (keys.ArrowDown) {
        socket.value?.emit('move', 'down')
    }
}
</script>
