<template>
    <div
        class="border-2 border-white rounded-full"
        :class="{
            'bg-background': status === 'OFFLINE',
            'bg-primary': status === 'ONLINE',
            'bg-secondary': status === 'INQUEUE',
            'bg-tertiary': status === 'INGAME',
        }"
        :title="status"
    ></div>
</template>

<script setup>
const { status } = defineProps(['status'])
</script>
