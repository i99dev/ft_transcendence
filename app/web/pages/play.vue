<template>
    <div>
        <div v-if="showSelector"
            class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center">
            <div class="flex flex-col items-center">
                <GameSelector @gameSelected="startGame" ref="gameSelector" @leaveQueue="leaveQueue" />
            </div>
        </div>

        <div>
            <GameClosePopup v-if="exit" @closePopup="switchExistStatus(false)" @GiveUp="exitGame" summary="Exit Game"
                detail="You will be considered a LOSER since you give up in middle of the game!!"
                confirmation="Are you sure you want to exit the game?" />
            <div class="container">
                <div class="relative w-full h-full">
                    <GameBoard v-if="showBoard" @ReadyGame="setGameReady" @GameOver="gameOver($event)"
                        @ExitBtn="switchExistStatus(true)" ref="gameBoard" />
                </div>
            </div>
            <GameResult v-if="gameResult" @vnode-mounted="exit = false" :gameResultMessage="gameResultMessage"
                @playAgain="playAgain" />
        </div>
    </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { useSocket, useTabEvent } from '@/composables/Game/useSocket'
const exit = ref(false);
const showSelector = ref(true)
const showBoard = ref(false)
const gameResult = ref(false)
const gameResultMessage = ref('')
const gameBoard = ref()
const gameSelector = ref()

const { emitLeaveQueue } = useSocket()

const startGame = (mode: GameSelectDto): void => {
    showBoard.value = true

    setTimeout(() => {
        gameBoard.value.setup(mode)
    }, 1000);
    gameResult.value = false
}

const playAgain = (): void => {
    showSelector.value = true;
    showBoard.value = false;
    gameResult.value = false;
}

const gameOver = (message: string): void => {
    gameResult.value = true
    gameResultMessage.value = message
    showBoard.value = false
}

const leaveQueue = (): void => {
    emitLeaveQueue()
    gameBoard.value.destroy()
    setTimeout(() => {
        showBoard.value = false
    }, 1000)
    console.log('leave queue !!')

}
const setGameReady = (): void => {
    showSelector.value = false
    gameResult.value = false
}

const exitGame = (): void => {
    gameBoard.value.giveUp()
    showBoard.value = false
    exit.value = false
    showSelector.value = true
    gameResult.value = false
}

const powerup = (): void => {
    gameBoard.value.powerup()
}

const switchExistStatus = (status: boolean): void => {
    exit.value = status
}
</script>

<style>
body {
    background-color: #202020;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0vh;
    padding: 0;
    min-height: 100vh;
    min-width: 100vw;
    position: relative;
    height: 100vh;
}
</style>
