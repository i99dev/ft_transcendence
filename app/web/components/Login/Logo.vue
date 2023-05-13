<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <div
            class="w-1/2 aspect-square centered rounded-full bg-gradient-to-b from-primary to-tertiary animate-bounce"
        >
            <img src="/crack-icon.png" alt="cracked ball" class="h-full w-full p-3 pt-1 pl-1" />
        </div>
        <h1 class="text-primary w-fit text-4xl text-center whitespace-nowrap font-[CyberGlitch]">
            {{ useRuntimeConfig().GAME_NAME }}
        </h1>
    </div>
</template>
