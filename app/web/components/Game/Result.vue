<template>
    <div>
        <div class="result-background fixed inset-0 backdrop-blur-sm text-9xl text-white"></div>
        <div class="fixed inset-0 overflow-y-auto transition-all duration-700 ease-in">
            <div
                class="min-h-full flex space-y- justify-center items-center text-center flex-col p-4 sm:items-center sm:p-0"
            >
                <h1 class="game-result uppercase text-white animate-bounce text-[10vw]">
                    {{ gameResultMessage }}
                </h1>
                <div class="after-game-options flex justify-center space-x-4">
                    <button
                    v-click-effect="() => navigateTo('/')"
                        class="rounded-md shadow-slate-50 border border-white bg-tertiary bg-opacity-75 hover:bg-opacity-100 text-white transation-all duration-300 hover:scale-105 active:scale-95 text-lg px-4 py-1.5"
                    >
                        Home
                    </button>
                    <button
                    v-click-effect=" () => $emit('playAgain')"
                        class="rounded-md shadow-slate-50 border border-white bg-primary bg-opacity-75 transation-all duration-300 hover:scale-110 active:scale-95 hover:bg-opacity-100 text-white text-lg px-4 py-1.5"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { gameResultMessage } = defineProps(['gameResultMessage'])
</script>
<style>
.game-result {
    text-shadow: 0 0 5px #fff;
}
</style>
