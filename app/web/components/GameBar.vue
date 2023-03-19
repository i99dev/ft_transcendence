<template>
  <div class="game-options">
      <button @click="navigateTo('/')" class="bg-slate-600 hover:bg-slate-100 border-t border-x rounded-t-xl text-slate-300 hover:text-slate-600 uppercase">
          x
      </button>
  </div>
</template>

<script setup>

</script>

<style scoped>

.game-options {
    width: 8%;
    height: 5%;
    position: relative;
    margin: 0;
    padding: 0;
}

button {
    width: 100%;
    height: 100%;
    font-size: 100%;
    line-height: 100%;
}

</style>