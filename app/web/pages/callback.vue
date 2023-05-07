<template>
    <div class="centered h-screen w-full">
        <div>Almost there</div>
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
