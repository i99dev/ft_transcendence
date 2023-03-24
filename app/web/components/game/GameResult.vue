<template>
  <div class="fixed inset-0 z-10 overflow-y-auto transition-all duration-700 ease-in">
      <div class="min-h-full flex justify-center items-center text-center flex-col p-4 sm:items-center sm:p-0">
        <h1 class="game-result uppercase text-white animate-bounce" style="font-size: 10vw;">{{ gameResultMessage }}</h1>
          <div class="after-game-options flex justify-around h-16 w-8">
            <div class="h-full mr-1">
              <button @click="() => navigateTo('/')" class="rounded-md shadow-slate-50 bg-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 w-full h-full text-xl px-5 py-2.5 text-center">Home</button>
            </div>
            <GameLoadingButton class="h-full ml-1" @startGame="$emit('playAgain')"/>
          </div>
      </div>
  </div>
</template>

<script setup>

const { gameResultMessage } = defineProps(['gameResultMessage'])

</script>

<style scoped>

.game-result {
  color: white;
  text-shadow: 0 0 5px #fff;
}

</style>