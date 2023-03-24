<template>
    <GameLoadingButton v-if="!ready && firstGameReady" @StartGame="startGame" class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center bg-slate-700" />
    <div>
        <GameClosePopup
            v-if="exit"
            @closePopup="switchExistStatus(false)"
            @GiveUp="exitGame"
            summary="Exit Game"
            detail="You will be considered a LOSER since you give up in middle of the game!!"
            confirmation="Are you sure you want to exit the game?"
        />
        <div class="container">
            <Button @click="switchExistStatus(true)" icon="pi pi-times" severity="success" rounded />
            <GameBoard @ReadyGame="setGameReady" @GameOver="gameOver($event)" ref="gameBoard" />
        </div>
        <GameResult v-if="gameResult" :gameResultMessage="gameResultMessage" @playAgain="playAgain"/>
    </div>
</template>

<script setup>

let exit = ref(false);
let ready = ref(false)
let firstGameReady = ref(true)
let gameResult = ref(false)
let gameResultMessage = ref("")
let gameBoard = ref()

const startGame = () => {
    gameBoard.value.socketSetup()
    gameResult.value = false
}

const playAgain = () => {
    gameBoard.value.socketSetup()
}

const gameOver = (message) => {
    gameBoard.value.gameUnmounted()
    firstGameReady.value = false
    ready.value = false
    gameResult.value = true
    gameResultMessage.value = message
}
        
const setGameReady = () => {
    ready.value = true
    gameResult.value = false
}

const exitGame = () => {
    gameBoard.value.giveUp()
    gameBoard.value.gameUnmounted()
    exit.value = false
    ready.value = false
    gameResult.value = false
}

const switchExistStatus = (status) => {
    exit.value = status;
}

</script>

<style>

body {
    background-color: #334155;
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