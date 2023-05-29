<template>
    <div>
        <div class="result-background fixed inset-0 backdrop-blur-sm text-9xl text-white z-1"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto transition-all duration-700 ease-in">
            <div
                class="min-h-full flex justify-center items-center text-center flex-col p-4 sm:items-center sm:p-0"
            >
                <h1 class="game-result uppercase text-white animate-bounce text-[10vw]">
                    {{ gameResultMessage }}
                </h1>
                <div class="after-game-options flex justify-center space-x-4">
                    <button
                        @click="() => navigateTo('/')"
                        class="rounded-md shadow-slate-50 bg-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-lg px-4 py-1.5"
                    >
                        Home
                    </button>
                    <button
                        @click="() => $emit('playAgain')"
                        class="rounded-md shadow-slate-50 bg-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-lg px-4 py-1.5"
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
