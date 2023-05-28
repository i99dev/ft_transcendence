<template>
    <div>
        <Loading class="w-screen h-screen centered" size="w-32" />
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
