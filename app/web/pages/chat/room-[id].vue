<template>
    <div>
        <h1>Chat</h1>
        <p>Chat page {{ id }}</p>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const { id } = router.currentRoute.value.params
console.log(id)
</script>
