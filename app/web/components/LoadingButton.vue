<template>
  <div id="Home" class="fixed inset-0 z-10 overflow-y-auto flex h-screen w-full justify-center items-center bg-slate-700">
      <Button type="button" label="Quick Match" :loading="loading" hiddenIcon="searching" @click="load" />
  </div>
</template>

<script setup lang="ts">


const loading = ref()
const emit = defineEmits(['startGame'])

const load = async () => {
    loading.value = true;
    await setTimeout(() => {
      loading.value = false;
      emit('startGame')
    }, 2000);
};
</script>

<style scoped>

</style>