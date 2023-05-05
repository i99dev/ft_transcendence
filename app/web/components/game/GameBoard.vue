<template>
    <div>
        <GameStatusBar v-if="showStatusBar" @ExitBtn="$emit('ExitBtn')" :cooldown11="pu1Cooldowns[0]"
            :cooldown12="pu1Cooldowns[1]" :cooldown21="pu2Cooldowns[0]" :cooldown22="pu2Cooldowns[1]" />
        <canvas ref="canvasRef" style="width: 100%; height: 100%;"></canvas>
    </div>
</template>

<script lang="ts" setup>

import { ref, defineEmits, defineExpose, onUnmounted, provide } from 'vue';
import { useSocket, useSound } from '~/composables/Game/useSocket';
import { useGameRenderer } from '~/composables/Game/useGameRenderer';

let canvasRef = ref<HTMLCanvasElement>();
let gameSetup = useState<SetupDto>('gameSetup');
let gameData = useState<gameStatusDto>('gameData');
const pu1Cooldowns = ref([false, false]);
const pu2Cooldowns = ref([false, false]);
const showStatusBar = ref(false);

const { init_game, updatePlayer, updateBall, rescaleGameData, reset } = useGameRenderer();
const { socket, emitStartGame, setupSocketHandlers, gameWinner, resetSocket } = useSocket();

const emit = defineEmits(['ReadyGame', 'GameOver', "ExitBtn"]);
defineExpose({ setup, giveUp, destroy });

const playSound = (sound: string): void => {
    const random = Math.floor(Math.random() * 2) + 1;
    const audio = new Audio(`/sounds/${sound}-${random}.mp3`);
    audio.volume = 0.2;
    audio.play();
};

useSound(playSound);

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false
};

onMounted(() => {
    window.addEventListener('popstate', handleArrows);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('popstate', handleArrows);
    reset();
});

const handleArrows = (e: PopStateEvent): void => {
    giveUp()
};

const emitGameOver = (winner: string): void => {
    if (winner == gameSetup.value.game.players[gameSetup.value.player].username) {
        emit('GameOver', 'you won');
        const winSound = new Audio('/sounds/win.mp3');
        winSound.play();
    } else {
        emit('GameOver', 'you lost');
        const loseSound = new Audio('/sounds/lose.mp3');
        loseSound.play();
    }

    reset();
    showStatusBar.value = false;
};

watch(gameWinner, (newVal, oldVal) => {
    if (newVal) {
        emitGameOver(newVal);
    }
});

function destroy(): void {
    resetSocket();
    reset();
}

function giveUp(): void {
    socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player]);
    destroy();
}

function setup(mode: GameSelectDto): void {
    resetSocket();
    emitStartGame(mode);
    setupSocketHandlers();
    windowEvents();
}

const windowEvents = (): void => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
};

watch(gameSetup, (newVal, oldVal) => {
    showStatusBar.value = true;
    if (newVal.game != oldVal.game) {
        emit('ReadyGame');
        rescaleGameData(newVal.game);
        init_game(canvasRef as Ref<HTMLCanvasElement>);
    }
});

watch(gameData, (newVal, oldVal) => {
    if (newVal) {
        updatePaddleDirection();
        rescaleGameData(newVal);
        updatePlayer(gameData.value.players);
        updateBall(gameData.value.ball);
    }
});

const startPowerCooldown = (player: number, key: number): void => {
    if (player == 0) {
        if (pu1Cooldowns.value[key]) return;
        pu1Cooldowns.value[key] = true;
        setTimeout(() => {
            pu1Cooldowns.value[key] = false;
        }, 5000);
    } else if (player == 1) {
        if (pu2Cooldowns.value[key]) return;
        pu2Cooldowns.value[key] = true;
        setTimeout(() => {
            pu2Cooldowns.value[key] = false;
        }, 5000);
    }
};

const activatePowerUp = (key: string): void => {
    if (key == '1') {
        socket.value.emit('Power-Up', 1);
        startPowerCooldown(gameSetup.value.player, 0);
    } else if (key == '2') {
        socket.value.emit('Power-Up', 2);
        startPowerCooldown(gameSetup.value.player, 1);
    }
};

const handleKeyDown = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
    }

    if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        keys[event.key] = true;
    } else if (event.key == '1' || event.key == '2' || event.key == '3' || event.key == '4') {
        activatePowerUp(event.key);
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