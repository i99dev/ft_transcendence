<template>
    <GameLoadingButton v-if="!ready" @StartGame="startGame"/>
    <div>
        <GameClosePopup
            v-if="exit"
            @closePopup="switchExistStatus(false)"
            summary="Exit Game"
            detail="You will be considered a LOSER since you give up in middle of the game!!"
            confirmation="Are you sure you want to exit the game?"
        />
        <div class="container">
            <Button @click="switchExistStatus(true)" icon="pi pi-times" severity="success" rounded />
            <GameBoard @ReadyGame="() => ready = true" ref="gameBoard" />
        </div>
    </div>
</template>

<script setup>

let exit = ref(false);
let ready = ref(false)
let gameBoard = ref()

const startGame = () => {
    gameBoard.value.socketSetup()
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