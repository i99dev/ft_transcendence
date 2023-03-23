<template>
    <GameLoadingButton v-if="!ready" @StartGame="startGame"/>
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
            <GameBoard @ReadyGame="() => ready = true" @GameOver="gameOver" ref="gameBoard" />
        </div>
        <GameResult v-if="gameResult" :gameResult="gameResultMessage"/>
    </div>
</template>

<script setup>

let exit = ref(false);
let ready = ref(false)
let gameResult = ref(undefined)
let gameResultMessage = ref("winner")
let gameBoard = ref()

watch(gameResult, () => {
    if (gameResult.value == "winner")
        gameResultMessage.value = "you won"
    else if (gameResult.value == "loser")
        gameResultMessage.value = "you lost"
})

const startGame = () => {
    gameBoard.value.socketSetup()
}

const gameOver = () => {
    console.log('result')

    gameResult.value = "winner"
    // gameResult.value = result

    gameBoard.value.socketDisconnect()

}

const exitGame = () => {
    gameBoard.value.giveUp()
    gameBoard.value.socketDisconnect() // should be removed
    exit.value = false
    ready.value = false
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