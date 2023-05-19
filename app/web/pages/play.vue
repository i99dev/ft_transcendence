<template>
    <div>
        <img
            src="/imgs/audio.png"
            alt="Stop audio"
            @click="toggleAudio"
            class="fixed top-4 right-4 cursor-pointer w-8 h-8 z-50"
        />
        <div
            v-if="showSelector"
            class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center"
        >
            <div class="flex flex-col items-center">
                <GameSelector
                    @gameSelected="startGame"
                    ref="gameSelector"
                    @leaveQueue="leaveQueue"
                />
            </div>
        </div>

        <div>
            <GameClosePopup
                v-if="exit"
                @closePopup="switchExistStatus(false)"
                @GiveUp="exitGame"
                summary="Exit Game"
                detail="You will be considered a LOSER since you give up in middle of the game!!"
                confirmation="Are you sure you want to exit the game?"
            />
            <div
                class="container flex justify-center items-center flex-col m-0 p-0 min-h-screen min-w-screen relative h-screen"
            >
                <div class="relative w-full h-full">
                    <GameBoard
                        v-if="showBoard"
                        @ReadyGame="setGameReady"
                        @GameOver="gameOver($event)"
                        @ExitBtn="switchExistStatus(true)"
                        ref="gameBoard"
                    />
                </div>
            </div>
            <GameResult
                v-if="gameResult"
                @vnode-mounted="exit = false"
                :gameResultMessage="gameResultMessage"
                @playAgain="playAgain"
            />
        </div>
        <div
            v-if="showTab"
            class="fixed z-50 inset-0 bg-black bg-opacity-70 flex items-center justify-center"
        >
            <div class="bg-white p-6 rounded-md text-center">
                <h2 class="text-xl font-semibold mb-4">You can't use the app on multiple tabs</h2>
                <p>Please use the other tab.</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSocket, useTabEvent } from '../composables/Game/useSocket'
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

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
const audio = ref(new Audio('/sounds/ost1.mp3'))
audio.value.loop = true
audio.value.volume = 0.1

onMounted(() => {
    // audio.play().catch(err => {
    //     audio.pause()
    //     document.addEventListener('click', function () {
    //         audio.play()
    //     })
    // })
})

onBeforeUnmount(() => {
    // audio.pause()
})

onUnmounted(() => {
    audio.value?.pause()
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

const toggleAudio = (): void => {
    if (audio.value?.paused) {
        audio.value?.play()
    } else {
        audio.value?.pause()
    }
}
const switchExistStatus = (status: boolean): void => {
    exit.value = status
}
</script>

<style>
body {
    background-color: #202020;
}
</style>
