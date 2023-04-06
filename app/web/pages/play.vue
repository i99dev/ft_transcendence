<template>
	<div>
		<div
		  v-if="!ready && firstGameReady"
		  class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center bg-slate-700"
		>
		  <div class="flex flex-col items-center">
			<div class="text-center mb-4">
			  <h1 class="text-4xl font-bold">Game Mode</h1>
			  <p class="text-lg">Choose the mode of your next game !</p>
			</div>
			<div class="flex justify-between w-10">
			  <button
				@click="startGame('solo')"
				type="button"
				class="h-full w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center cursor-pointer"
				style="margin-right: 20px;"
			  >
				Solo
			  </button>
			  <GameLoadingButton @StartGame="startGame('duo')" />
			</div>
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
            <div class="container">
                <Button @click="switchExistStatus(true)" icon="pi pi-times" />
                <Button class="button-wrapper" @click="powerup" />
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

const startGame = (mode: string): void => {
    gameBoard.value.setup(mode)
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

const powerup = (): void => {
    console.log('powerup')
    gameBoard.value.powerup()
}

const switchExistStatus = (status: boolean): void => {
    exit.value = status
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

.button-wrapper {
    position: relative;
    top: 100px;
    right: 750px;
    background-color: #ccc;
    color: #fff;
    border: none;
    padding: 10px 70px;
    cursor: pointer;
}

.button-wrapper:hover {
    background-color: #999;
}

.button-wrapper:active {
    background-color: #666;
}
</style>
