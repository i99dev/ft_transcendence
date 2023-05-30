<template>
    <div>
        <div class="min-h-screen text-center justify-center overflow-hidden py-20">
            <div class="flex flex-col items-center">
                <div class="w-1 h-2 centered animate-bounce">
                    <h1
                        class="text-primary mt-20 w-fit text-5xl md:text-9xl whitespace-nowrap font-[CyberGlitch] text-center"
                    >
                        {{ useRuntimeConfig().GAME_NAME }}
                    </h1>
                </div>
            </div>
            <h1 class="text-2xl font-bold mb-10 mt-20 text-white translate-y-2">The Pong Game</h1>
            <div class="container mx-auto p-4 lg:p-3">
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div
                        v-for="info in gameInfo"
                        :key="info.title"
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12"
                    >
                        <div class="flex items-center text-tertiary">
                            <p class="text-sm font-bold uppercase">{{ info.title }}</p>
                        </div>

                        <h2 class="mt-4 text-3xl font-semibold text-secondary_light">
                            {{ info.subtitle }}
                        </h2>

                        <div v-if="info.title === 'Achievements'">
                            <template v-for="description in info.description">
                                <p
                                    class="mt-4 text-lg"
                                    :class="getClassForDescription(description, info)"
                                >
                                    {{ description }}
                                </p>
                            </template>
                        </div>
                        <div v-else v-for="des in info.description">
                            <p v-if="info.title != 'Rank System'" class="mt-4 text-lg text-white">
                                {{ des }}
                            </p>
                        </div>

                        <div
                            class="mt-20 flex col-auto transform items-center justify-center transition-transform duration-150 ease-in-out"
                        >
                            <div
                                v-if="info.title == 'Achievements'"
                                class="grid grid-cols-3 mb-5 gap-4 smooth-transition hover:scale-105"
                            >
                                <div
                                    v-for="achv in achievements"
                                    class="mt-3 mb-10 rounded-full border overflow-hidden"
                                    :class="getAchvType(achv.type, false)"
                                >
                                    <img :src="achv.image" class="w-full h-full object-cover" />
                                    <span
                                        class="absolute text-white text-xs px-1 rounded-bl rounded-tr"
                                        :class="getAchvType(achv.type, true)"
                                    >
                                        {{ achv.type }}
                                    </span>
                                </div>
                            </div>

                            <div
                                v-if="info.title == 'Rank System'"
                                class="flex justify-center mt-2"
                            >
                                <div
                                    v-for="(rectangle, index) in rectangles"
                                    :key="index"
                                    class="relative w-16 h-[80px] mx-4 mt-20 group"
                                >
                                    <div
                                        class="flex absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 bg-white shadow-xl shadow-tertiary_dark smooth-transition group-hover:scale-110"
                                        :style="{ height: rectangle.height + '%' }"
                                    ></div>
                                    <div
                                        class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 translate-y-1/3 text-center text-white"
                                    >
                                        {{ info.description[index] }}
                                    </div>

                                    <div
                                        class="invisible bg-background border-1 border-secondary group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-3 py-2 text-md shadow-lg rounded w-auto md:min-w-[260px] md:max-w-xl md:px-4 md:py-3 z-10"
                                        :style="'min-width: 200px;'"
                                    >
                                        <h1 class="text-bold text-lg text-tertiary border-b">
                                            {{ info.description[index] }}
                                        </h1>
                                        <p class="text-white">XP: {{ ranksInfo[index].XP }}</p>
                                        <p class="text-white">{{ ranksInfo[index].Description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-if="info.title == 'Controls'"
                                class="flex flex-col items-center shadow-xl shadow-secondary_dark"
                            >
                                <svg
                                    style="color: blueviolet"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="80"
                                    height="80"
                                    fill="currentColor"
                                    class="bi bi-arrow-up-square-fill mb-2"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"
                                        fill="white"
                                    ></path>
                                </svg>
                                <svg
                                    style="color: blueviolet"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="80"
                                    height="80"
                                    fill="currentColor"
                                    class="bi bi-arrow-down-square-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"
                                        fill="white"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const achievements = await getAllAchievements()

console.log('achvs', achievements)

const gameInfo = computed(() => {
    return [
        {
            title: 'Game Modes',
            subtitle: 'There are two game modes available:',
            description: [
                'This game mode activates power-ups during the game, enhancing the gameplay experience by introducing special abilities or advantages for the players.',
                'Classic: Play the game without any power-ups.',
            ],
        },
        {
            title: 'Players',
            subtitle: 'In both game modes, you have two options for players:',
            description: [
                'Single Player (with Bot): Play alone against a computer-controlled opponent.',
                'Online Multiplayer: Play against someone online.',
            ],
        },
        {
            title: 'Controls',
            subtitle: 'Use the following controls to play the game:',
            description: [
                'Arrow Buttons: Move the player paddle left and right.',
                '1 and 2 Buttons: Activate power-ups.',
            ],
        },
        {
            title: 'Rank System',
            subtitle: 'There are six Ranks in this game:',
            description: [
                'Capin Boy',
                'Kaizoku',
                'Super Rookie',
                'Shichbukai',
                'Yonko',
                'Kaizoku O',
            ],
        },
        {
            title: 'Achievements',
            subtitle: 'Two types of Achievments are available:',
            description: [
                'Mid-game achievements:',
                'The one you can get during the game.',
                'Post-Game achievements:',
                ' The one you can get after the game.',
            ],
        },
    ]
})

const ranksInfo = [
    {
        XP: '+10/win +2/lose',
        Description: 'Requires 10 wins to advance to next level',
    },
    {
        XP: '+20/win +4/lose',
        Description: 'Requires 60% W/R + 150XP to advance to next level',
    },
    {
        XP: '+30/win +6/lose',
        Description: 'Requires 55% W/R + 600XP to advance to next level',
    },
    {
        XP: '+40/win +8/lose',
        Description: 'Requires 50% W/R + 1500XP to advance to next level',
    },
    {
        XP: '+50/win +10/lose',
        Description: 'Requires 45% W/R + 3500XP to advance to next level',
    },
    {
        XP: '+60/win +12/lose',
        Description: 'Requires 40% W/R + 6000XP to advance to next level',
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

const getAchvType = (type: string, isText: boolean) => {
    if (type === 'Serial Killer' || type === 'Rookie no more' || type === 'First Blood')
        return isText ? 'bg-accent_dark' : 'border-accent_dark shadow-xl shadow-accent_dark'
    else return isText ? 'bg-primary_dark' : 'border-primary_dark shadow-xl shadow-primary_dark'
}

const rectangles = [
    { height: 70 },
    { height: 100 },
    { height: 130 },
    { height: 150 },
    { height: 180 },
    { height: 210 },
]
</script>
