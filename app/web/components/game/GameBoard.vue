<template>
    <div>
        <GameStatusBar @ExitBtn="$emit('ExitBtn')" :cooldown1="powerup1Cooldown" :cooldown2="powerup2Cooldown" />
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
const powerup1Cooldown = ref(false);
const powerup2Cooldown = ref(false);
defineExpose({ setup, giveUp })
const emit = defineEmits(['ReadyGame', 'GameOver'])

const { init_game, updatePlayer, updateBall, rescaleGameData } = useGameRenderer()

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false
};

const emitGameOver = (winner: string): void => {
    if (winner == gameSetup.value.game.players[gameSetup.value.player].username)
        emit('GameOver', 'you won')
    else
        emit('GameOver', 'you lost')
}

const { socket, emitStartGame, setupSocketHandlers, resetSocket } = useSocket(emitGameOver)

function giveUp(): void {
    socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player])
    resetSocket()
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


const activatePowerUp = (key: string): void => {
    if (key == '1') {
        socket.value.emit('Power-Up', 1);
        powerup1Cooldown.value = true;
        setTimeout(() => {
            powerup1Cooldown.value = false;
        }, 5000);
    } else if (key == '2') {
        socket.value.emit('Power-Up', 2);
        powerup2Cooldown.value = true;
        setTimeout(() => {
            powerup2Cooldown.value = false;
        }, 5000);
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