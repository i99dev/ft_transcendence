<template>
    <div class="fixed inset-0 top-1/4 left-1/2 z-20 w-1 h-2 centered animate-bounce">
        <h1
            class="text-primary mt-20 w-fit text-9xl scale-150 whitespace-nowrap"
            :class="[announcmentMessage == 'Deuce!' ? 'font-[CyberGlitch]' : 'font-[FunGames]']"
        >
            {{ announcmentMessage }}
        </h1>
    </div>
</template>

<script lang="ts" setup>
const { announcmentMessage } = useGameAnnouncment()
</script>
