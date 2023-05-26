<template>
    <div>
        <div class="min-h-screen text-center justify-center overflow-hidden py-20">
            <div class="flex flex-col items-center">
                <div class="w-1 h-2 centered animate-bounce">
                    <h1 class="text-primary mt-20 w-fit text-9xl whitespace-nowrap font-[CyberGlitch]">
                        {{ useRuntimeConfig().GAME_NAME }}
                    </h1>
                </div>
            </div>
            <h1 class="text-2xl font-bold mb-20 shadow-xl shadow-secondary mt-20 text-white">The Ping Pong Game</h1>
            <div class="container mx-auto p-4 lg:p-3">
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">

                    <div v-for="ann in announcement" :key="ann.title"
                        class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12">
                        <div class="flex items-center text-blue-500">
                            <p class="text-sm font-bold uppercase">{{ ann.title }}</p>
                        </div>

                        <h2 class="mt-4 text-3xl font-semibold text-violet-500 "> {{ ann.subtitle }} </h2>

                        <div v-for="des in ann.description">

                            <p class="mt-4 text-lg text-slate-300">{{ des }}
                            </p>

                        </div>
                        <div
                            class="mt-12 flex col-auto transform items-center justify-center transition-transform duration-150 ease-in-out hover:scale-125">
                            <div v-if="ann.title == 'Controls'" class="flex flex-col items-center">
                            <svg style="color: blueviolet" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-arrow-up-square-fill mb-2" viewBox="0 0 16 16"> <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" fill="white"></path> </svg>
                            <svg style="color: blueviolet" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-arrow-down-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" fill="white"></path> </svg>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const announcement = computed(() => {
    return [
        {
            title: 'Game Modes',
            subtitle: 'There are two game modes available:',
            image: '../assets/devilfruit.png',
            description: ['Custom: Activates power-ups during the game.', 'Classic: Play the game without any power-ups.']
        },
        {
            title: 'Players',
            subtitle: 'In both game modes, you have two options for players:',
            image: '../assets/devilfruit.png',
            description: ['Single Player (with Bot): Play alone against a computer-controlled opponent.', 'Online Multiplayer: Play against someone online.']
        },
        {
            title: 'Controls',
            subtitle: 'Use the following controls to play the game:',
            image: '../assets/devilfruit.png',
            description: ['Arrow Buttons: Move the player paddle left and right.', '1 and 2 Buttons: Activate power-ups.']
        },
        {
            title: 'Rank System',
            subtitle: 'There are six Ranks in this game:',
            image: '../assets/devilfruit.png',
            description: []
        },
        {
            title: 'Achievements',
            subtitle: 'There are two types of Achievments you can get:',
            image: '../assets/devilfruit.png',
            description: ['Mid-game achievements: The one you can get during the game.', 'Post-Game achievements: The one you can get after the game.']
        },
    ];
});

</script>

