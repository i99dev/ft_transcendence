<template>
  <div class="fixed inset-0 z-10 overflow-y-auto transition-all duration-700 ease-in">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <h1 class="uppercase text-white text-9xl animate-bounce">{{ gameResult  }}</h1>
      </div>
  </div>
</template>

<script setup>

const { gameResult } = defineProps(['gameResult'])

</script>

<style scoped>

h1 {
  color: white;
  text-shadow: 0 0 5px #fff;
}

</style>