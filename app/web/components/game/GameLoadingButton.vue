<template>
  <div>
      <Button type="button" :label="name" :loading="loading" hiddenIcon="searching" @click="load" class="p-button-lg" style="font-size: 2rem" />
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
