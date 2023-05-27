<template>
    <div>
        <Loading class="w-screen h-screen centered" />
    </div>
</template>

<script setup>
definePageMeta({
    layout: false,
})

definePageMeta({
    middleware: ['auth'],
})
</script>
