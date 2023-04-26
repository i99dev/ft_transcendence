<template>
    <div>
        <div
            v-if="!ready && firstGameReady"
            class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center bg-slate-700"
        >
            <GameLoadingButton @StartGame="startGame" />
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
            <div class="container">
                <Button @click="switchExistStatus(true)" icon="pi pi-times" />
                <GameBoard @ReadyGame="setGameReady" @GameOver="gameOver($event)" ref="gameBoard" />
            </div>
            <GameResult
                v-if="gameResult"
                :gameResultMessage="gameResultMessage"
                @playAgain="playAgain"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
let exit = ref(false)
let ready = ref(false)
let firstGameReady = ref(true)
let gameResult = ref(false)
let gameResultMessage = ref('')
let gameBoard = ref()

const startGame = (): void => {
    gameBoard.value.setup()
    gameResult.value = false
}

const playAgain = (): void => {
    gameBoard.value.setup()
}

const gameOver = (message: string): void => {
    gameBoard.value.destroy()
    firstGameReady.value = false
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
}


const switchExistStatus = (status: boolean): void => {
    exit.value = status
}
</script>
