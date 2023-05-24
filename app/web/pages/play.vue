<template>
<<<<<<< HEAD
    <div>
        <div class="fixed top-4 right-8 cursor-pointer w-8 h-8 z-50">
            <button v-if="muteSound" v-click-effect="handleMuteSound"
                class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-volume-mute fill-white w-10 h-10" viewBox="0 0 16 16">
                    <path
                        d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                </svg>
            </button>
            <button v-else v-click-effect="handleMuteSound"
                class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-volume-up fill-white w-10 h-10" viewBox="0 0 16 16">
                    <path
                        d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                    <path
                        d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                    <path
                        d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z" />
                </svg>
            </button>
        </div>
=======
    <div class="no-context-menu">
        <img src="/imgs/audio.png" alt="Stop audio" @click="toggleAudio"
            class="fixed top-4 right-4 cursor-pointer w-8 h-8 z-50" />
>>>>>>> origin/min-requirements
        <div v-if="showSelector"
            class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center">
            <div class="flex flex-col items-center">
                <GameSelector v-if="showSelector" @gameSelected="startGame" ref="gameSelector" @leaveQueue="leaveQueue" />
            </div>
        </div>

        <div>
            <GameClosePopup v-if="exit" @closePopup="switchExistStatus(false)" @GiveUp="exitGame" summary="Exit Game"
                detail="You will be considered a LOSER since you give up in middle of the game!!"
                confirmation="Are you sure you want to exit the game?" />
            <div
                class="container flex justify-center items-center flex-col m-0 p-0 min-h-screen min-w-screen relative h-screen">
                <div class="relative w-full h-full">
                    <GameBoard v-if="showBoard" @ReadyGame="setGameReady" @GameOver="gameOver($event)"
                        @ExitBtn="switchExistStatus(true)" ref="gameBoard" />
                </div>
            </div>
            <GameResult v-if="gameResult" @vue-mounted="exit = false" :gameResultMessage="gameResultMessage"
                @playAgain="playAgain" />
        </div>
        <div v-if="showTab" class="fixed z-50 inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div class="bg-white p-6 rounded-md text-center">
                <h2 class="text-xl font-semibold mb-4">You can't use the app on multiple tabs</h2>
                <p>Please use the other tab.</p>
            </div>
        </div>
        <GameInviteBox v-if="inviteModal.open" class="z-20" />
        <div
        v-show="showRotateOverlay"
        class="fixed inset-0 bg-gray-900 opacity-100 flex items-center justify-center text-white text-2xl z-30"
        >
        Please rotate your phone to landscape.
      </div>
    </div>

</template>

<script lang="ts" setup>
import { useSocket, useTabEvent } from '../composables/Game/useSocket'
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

const route = useRoute()
const { invite, inviteModal } = await useGameInvite()
const emit = defineEmits(['showTabModal'])
const exit = ref(false)
const showSelector = ref(true)
const showBoard = ref(false)
const gameResult = ref(false)
const gameResultMessage = ref('')
const gameBoard = ref()
const gameSelector = ref()
const { emitLeaveQueue } = useSocket()
const { showTab } = useTabEvent()
const { play, pause, loop, isPaused } = useSound()
const muteSound = ref(true as boolean)
const showRotateOverlay = ref(false)

loop('play')

onMounted(() => {
  checkOrientation();
  window.addEventListener('orientationchange', checkOrientation);
});

onBeforeUnmount(() => {
  window.removeEventListener('orientationchange', checkOrientation);
});

const checkOrientation = () => {
  let isPortrait;

  if ('orientation' in window.screen) {
    isPortrait = window.screen.orientation.type.startsWith('portrait');
  } else if ('orientation' in window) {
    isPortrait = window.orientation === 0 || window.orientation === 180;
  } else {
    isPortrait = window.innerHeight > window.innerWidth;
  }
  showRotateOverlay.value = isPortrait;
};

onUnmounted(() => {
    pause('play')
})

const startGame = (mode: GameSelectDto): void => {
    showBoard.value = true

    setTimeout(() => {
        gameBoard.value?.setup(mode)
    }, 1000)
    gameResult.value = false
}

const playAgain = (): void => {
    showSelector.value = true
    showBoard.value = false
    gameResult.value = false
}

const gameOver = (message: string): void => {
    gameResult.value = true
    gameResultMessage.value = message
    showBoard.value = false
}

const leaveQueue = (): void => {
    emitLeaveQueue()
    gameBoard.value?.destroy()
    setTimeout(() => {
        showBoard.value = false
    }, 1000)
}

const setGameReady = (): void => {
    showSelector.value = false
    gameResult.value = false
}

const exitGame = (): void => {
    gameBoard.value?.giveUp()
    showBoard.value = false
    exit.value = false
    showSelector.value = true
    gameResult.value = false
}

function handleMuteSound () {
    muteSound.value = !muteSound.value
    if (isPaused('play'))
        play('play')
    else if (!isPaused('play'))
        pause('play')
}
const switchExistStatus = (status: boolean): void => {
    exit.value = status
}

watchEffect(() => {
    if (route.path === '/play') {
        if (inviteModal.value.gameInProgress) {
            showSelector.value = false
            showBoard.value = true
            startGame({
                gameType: invite.value.gameType,
                gameMode: 'invite',
                powerups: invite.value.powerups
            })
            inviteModal.value.gameInProgress = false

        }
    }
})

</script>

<style>
.no-context-menu {
  user-select: none;
  -webkit-touch-callout: none;
}
</style>

