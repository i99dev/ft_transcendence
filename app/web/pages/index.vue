<template>
    <div
        id="Home"
        class="flex min-h-screen justify-center overflow-hidden bg-gray-50 py-6 sm:py-12"
    >
        <UserProfileCardOne class="items-start justify-start" />
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['pages'],
})
</script>
