<template>
    <div
        v-show="isDeuce"
        class="fixed inset-0 top-1/4 left-1/2 z-20 w-1 h-2 centered animate-bounce"
    >
        <h1 class="text-primary mt-20 w-fit text-9xl whitespace-nowrap font-[CyberGlitch]">
            Deuce!
        </h1>
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '~~/composables/Game/useSocket'

const { isDeuce } = useSocket()
</script>
