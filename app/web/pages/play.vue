<template>
    <div>
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
                <div class="w-1/3 flex justify-between">
                    <button class="bg-slate-400 text-sm p-2 rounded-t-md" @click="powerup">
                        PowerUp
                    </button>
                    <Button @click="switchExistStatus(true)" icon="pi pi-times" />
                    <button class="bg-slate-400 text-xs p-2 rounded-t-md" @click="powerup">
                        PowerUp
                    </button>
                </div>
                <GameBoard @ReadyGame="setGameReady" @GameOver="gameOver($event)" ref="gameBoard" />
            </div>
            <GameResult
                v-if="gameResult"
                @vnode-mounted="exit = false"
                :gameResultMessage="gameResultMessage"
                @playAgain="playAgain"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
let exit = ref(false)
let ready = ref(false)
let gameResult = ref(false)
let gameResultMessage = ref('')
let gameBoard = ref()

onMounted(() => {
    gameBoard.value.setup()
    gameResult.value = false
})

const playAgain = (): void => {
    gameBoard.value.setup()
}

const gameOver = (message: string): void => {
    gameBoard.value.destroy()
    ready.value = false
    gameResult.value = true
    gameResultMessage.value = message
}

const setGameReady = (): void => {
    ready.value = true
    gameResult.value = false
}

const exitGame = (): void => {
    gameBoard.value.giveUp()
    gameBoard.value.destroy()
    exit.value = false
    ready.value = false
    gameResult.value = false
    navigateTo('/')
}

const powerup = (): void => {
    gameBoard.value.powerup()
}

const switchExistStatus = (status: boolean): void => {
    exit.value = status
}
</script>

<style>
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
    /* overflow-y: hidden; */
}
</style>
