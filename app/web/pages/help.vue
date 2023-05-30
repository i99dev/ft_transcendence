<template>
    <div>
        <div class="min-h-screen text-center justify-center overflow-hidden py-5">
            <div class="flex flex-col items-center">
                <div class="w-1 h-fit centered animate-pulse">
                    <GlitchAnimation />
                    <h1
                        class="game-name text-primary w-fit text-5xl md:text-9xl whitespace-nowrap font-[CyberGlitch] text-center"
                    >
                        {{ useRuntimeConfig().GAME_NAME }}
                    </h1>
                </div>
                <h2 class="text-2xl font-bold mb-10 text-white">The Pong Game</h2>
            </div>
            <div class="container mx-auto p-4 lg:p-3">
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <h1 class="mt-4 font-semibold text-tertiary flex uppercase">game modes</h1>
                        <div v-for="gameMode in gameModes">
                            <h2 class="mt-4 text-xl font-semibold text-primary">
                                {{ gameMode.type }}
                            </h2>
                            <p class="mt-4 text-md text-white">
                                {{ gameMode.description }}
                            </p>
                        </div>
                    </div>
                    <div
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <h1 class="mt-4 font-semibold text-tertiary flex uppercase">
                            player options
                        </h1>
                        <div v-for="playerOption in playerOptions">
                            <h2 class="mt-4 text-xl font-semibold text-primary">
                                {{ playerOption.type }}
                            </h2>
                            <p class="mt-4 text-md text-white">
                                {{ playerOption.description }}
                            </p>
                        </div>
                    </div>
                    <div
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <h1 class="mt-4 font-semibold text-tertiary uppercase flex">controls</h1>
                        <div v-for="control in controls">
                            <h2 class="mt-4 text-xl font-semibold text-primary capitalize">
                                {{ control.type }}
                            </h2>
                            <p class="mt-4 text-md text-white">
                                {{ control.description }}
                            </p>
                            <div class="centered my-2 text-white">
                                <div
                                    class="bg-background_light p-2 rounded-xl smooth-transition hover:bg-tertiary hover:scale-110 w-10 h-10 m-2"
                                >
                                    <ArrowUpIcon
                                        v-if="control.type === 'movements'"
                                        class="w-full h-full"
                                    />
                                    <span v-else>1</span>
                                </div>
                                <div
                                    class="bg-background_light p-2 rounded-xl smooth-transition hover:bg-tertiary hover:scale-110 w-10 h-10 m-2"
                                >
                                    <ArrowDownIcon
                                        v-if="control.type === 'movements'"
                                        class="w-full h-full"
                                    />
                                    <span v-else>2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="relative mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <h1 class="mt-4 font-semibold text-tertiary uppercase flex">ranks</h1>
                        <div class="centered smooth-transition h-48 m-5 text-white">
                            <div
                                v-for="(rank, index) in ranks"
                                :key="index"
                                class="w-1/6 h-full sm:mx-4 mx-1 group smooth-transition flex flex-col-reverse items-center"
                            >
                                <div
                                    class="flex w-full bg-white shadow-xl shadow-tertiary_dark smooth-transition group-hover:scale-110 group-hover:bg-tertiary smooth-transition"
                                    :style="{ height: (index + 1) * 15 + '%' }"
                                ></div>
                                <div
                                    class="whitespace-nowrap text-center centered my-2 text-xs w-1/6"
                                >
                                    {{ rank.name }}
                                </div>

                                <div
                                    class="invisible bg-background overflow-hidden border-1 border-secondary group-hover:visible absolute top-0 left-1/2 transform -translate-x-1/2 p-2 m-2 text-md shadow-lg rounded md:py-3 z-10 smooth-transition"
                                >
                                    <h1 class="text-bold text-lg text-tertiary border-b">
                                        {{ rank.name }}
                                    </h1>
                                    <p class="text-xs whitespace-nowrap">XP: {{ rank.xp }}</p>
                                    <p class="text-xs whitespace-nowrap">{{ rank.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <h1 class="mt-4 font-semibold text-tertiary uppercase flex">
                            achievements
                        </h1>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-5 m-5">
                            <div v-for="achievement in achievements">
                                <div class="centered flex-col">
                                    <div
                                        class="relative w-20 md:w-24 xl:w-32 aspect-square rounded-full p-1 border border-white group hover:scale-125 smooth-transition"
                                    >
                                        <img
                                            :src="achievement?.image"
                                            :alt="achievement?.type"
                                            class="rounded-full object-cover group-hover:opacity-30 smooth-transition"
                                        />
                                        <div
                                            class="invisible group-hover:visible text-xs absolute top-0 left-0 w-full h-full text-white centered smooth-transition"
                                        >
                                            <span>
                                                {{ achievement.type }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

const achievements = await getAllAchievements()

const gameModes = [
    {
        type: 'Classic',
        description:
            'Normal mode with increasing ball speed for intense gameplay and a race to 11 points.',
    },
    {
        type: 'Custom',
        description:
            'Strategic mode with two power-ups, allowing players to gain an edge in their quest for victory.',
    },
]

const playerOptions = [
    {
        type: 'Single Player',
        description:
            'Practice mode against the computer. No consequences, just pure skill development and mastery!',
    },
    {
        type: 'Find Opponent',
        description:
            'Matchmaking excitement! Compete against real players, earn achievements, XP, and face the consequences of surrendering. Rise to the top and become a Pong legend!',
    },
]

const controls = [
    {
        type: 'movements',
        description: "use 'Up' and 'Down' keys to move your paddle OR click on them in mobile mode",
    },
    {
        type: 'power-ups',
        description:
            "use '1' and '2' keys to activate your power-ups OR click on them in mobile mode",
    },
]

const ranks = [
    {
        name: 'Capin Boy',
        xp: '+10/win +2/lose',
        description: 'Requires 10 wins',
    },
    {
        name: 'Kaizoku',
        xp: '+20/win +4/lose',
        description: 'Requires 60% W/R + 150XP',
    },
    {
        name: 'Super Rookie',
        xp: '+30/win +6/lose',
        description: 'Requires 55% W/R + 600XP',
    },
    {
        name: 'Shichbukai',
        xp: '+40/win +8/lose',
        description: 'Requires 50% W/R + 1500XP',
    },
    {
        name: 'Yonko',
        xp: '+50/win +10/lose',
        description: 'Requires 45% W/R + 3500XP',
    },
    {
        name: 'Kaizoku O',
        xp: '+60/win +12/lose',
        description: 'Requires 40% W/R + 6000XP',
    },
]

const getClassForDescription = (description: any, info: any) => {
    if (description === info.description[0]) {
        return 'text-primary_light'
    } else if (description === info.description[2]) {
        return 'text-accent_light'
    } else {
        return 'text-white'
    }
}
</script>

<style>
.game-name {
    filter: url(#glitchshadow);
}
</style>
