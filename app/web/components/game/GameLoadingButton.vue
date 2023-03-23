<template>
  <div id="Home" class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center bg-slate-700">
      <Button type="button" :label="name" :loading="loading" hiddenIcon="searching" @click="load" />
  </div>
</template>

<script setup lang="ts">

const loading = ref()
const emit = defineEmits(['startGame'])
let name = ref("Play")

const load = async () => {
    loading.value = true;
    name.value = "searching for opponent"
    emit('startGame')
};
</script>

<style scoped>

</style>