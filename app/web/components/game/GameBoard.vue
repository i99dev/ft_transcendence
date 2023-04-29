<template>
    <div>
        <GameStatusBar @ExitBtn="$emit('ExitBtn')" :cooldown11="p11Cooldown" :cooldown12="p12Cooldown"
            :cooldown21="p21Cooldown" :cooldown22="p22Cooldown" />
        <canvas ref="canvasRef" style="width: 100%; height: 100%;"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineExpose, onUnmounted, provide } from 'vue'
import { useSocket } from '~/composables/Game/useSocket'
import { useGameRenderer } from '~/composables/Game/useGameRenderer'

let canvasRef = ref<HTMLCanvasElement>()
let gameSetup = ref(useState<SetupDto>('gameSetup'))
let gameData = ref(useState<gameStatusDto>('gameData'))

const p11Cooldown = ref(false);
const p12Cooldown = ref(false);
const p21Cooldown = ref(false);
const p22Cooldown = ref(false);

defineExpose({ setup, giveUp })
const emit = defineEmits(['ReadyGame', 'GameOver', "ExitBtn"])

const { init_game, updatePlayer, updateBall, rescaleGameData, reset } = useGameRenderer()

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false
};

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    reset()
})

const emitGameOver = (winner: string): void => {
    if (winner == gameSetup.value.game.players[gameSetup.value.player].username)
        emit('GameOver', 'you won')
    else
        emit('GameOver', 'you lost')
    reset()
}

const { socket, emitStartGame, setupSocketHandlers, resetSocket } = useSocket(emitGameOver)

function giveUp(): void {
    socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player])
    resetSocket()
    reset()
}

function setup(mode: GameSelectDto): void {
    resetSocket();
    emitStartGame(mode)
    setupSocketHandlers()
    windowEvents()
}

const windowEvents = (): void => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp);
}

watch(gameSetup, (newVal, oldVal) => {
    if (newVal.game != oldVal.game) {
        emit('ReadyGame')
        rescaleGameData(newVal.game)
        init_game(canvasRef as Ref<HTMLCanvasElement>)
    }
})

watch(gameData, (newVal, oldVal) => {

    if (newVal) {
        updatePaddleDirection()
        rescaleGameData(newVal)
        updatePlayer(gameData.value.players)
        updateBall(gameData.value.ball)
    }
})

const startPowerCooldown = (player: number, key: string): void => {
    if (player == 0) {
        if (key == '1') {
            p11Cooldown.value = true;
            setTimeout(() => {
                p11Cooldown.value = false;
            }, 5000);
        } else if (key == '2') {
            p12Cooldown.value = true;
            setTimeout(() => {
                p12Cooldown.value = false;
            }, 5000);
        }
    } else if (player == 1) {
        if (key == '1') {
            p21Cooldown.value = true;
            setTimeout(() => {
                p21Cooldown.value = false;
            }, 5000);
        } else if (key == '2') {
            p22Cooldown.value = true;
            setTimeout(() => {
                p22Cooldown.value = false;
            }, 5000);
        }
    }
};

const activatePowerUp = (key: string): void => {
    if (key == '1') {
        socket.value.emit('Power-Up', 1);
        startPowerCooldown(gameSetup.value.player, key);
    } else if (key == '2') {
        socket.value.emit('Power-Up', 2);
        startPowerCooldown(gameSetup.value.player, key);
    }
};

const handleKeyDown = (event: KeyboardEvent): void => {

    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
    }

    if (event.key == 'ArrowUp' || event.key == 'ArrowDown')
        keys[event.key] = true;
    else if (event.key == '1' || event.key == '2' || event.key == '3' || event.key == '4') {
        activatePowerUp(event.key)
    }
};

const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = false;
    }
};

const updatePaddleDirection = (): void => {
    if (keys.ArrowUp) {
        socket.value.emit('move', 'up');
    } else if (keys.ArrowDown) {
        socket.value.emit('move', 'down');
    }
};

</script>