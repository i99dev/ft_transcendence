<template>
  <div class="fixed inset-0 z-10 overflow-y-auto transition-all duration-700 ease-in">
      <div class="min-h-full flex justify-center items-center text-center flex-col p-4 sm:items-center sm:p-0">
        <h1 class="game-result uppercase text-white animate-bounce" style="font-size: 10vw;">{{ gameResultMessage }}</h1>
          <div class="after-game-options flex justify-evenly h-16 w-8">
            <button @click="() => navigateTo('/')" class="rounded-md shadow-slate-50 bg-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-3 text-4xl">Home</button>
            <!-- <button @click="() => $emit('playAgain')" class="rounded-md shadow-blue-50 bg-blue-300 hover:bg-blue-200 text-blue-700 hover:text-blue-900 px-3 text-4xl">Play</button> -->
            <GameLoadingButton class="h-8" style="font-size: 2.25rem;line-height: 2.5rem" @startGame="$emit('playAgain')"/>
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