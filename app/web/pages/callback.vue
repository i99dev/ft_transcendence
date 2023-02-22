
<template>
  <div>
    <h1>Callback</h1>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
})

const query = useRoute().query
const { data, error } = await  sendAuthCode(query.code)
console.log(data, error)
</script>