<template>
    <div class="w-full">
        <div v-for="game in games" :key="game.id" class="w-full py-2">
            <div class="flex flex-row justify-between w-full">
                <div class="self-center">
                    <div class="flex flex-row space-x-2">
                        <img
                            src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                            class="w-8 h-8 rounded-full self-center"
                        />
                        <!-- name and result -->
                        <div class="flex flex-col text-center justify-center">
                            <div class="text-xs font-light">Player 1</div>
                            <div class="text-xs text-green-600 font-medium">Win</div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="flex flex-row space-x-4">
                        <!-- name and result -->
                        <div class="flex flex-col text-center justify-center">
                            <div class="text-xs font-light">Player 2</div>
                            <div class="text-xs text-red-600 font-medium">Lose</div>
                        </div>
                        <img
                            src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                            class="w-8 h-8 rounded-full self-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const games = [
    {
        id: 1,
        player1: {
            name: 'Player 1',
            result: 'Win',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        player2: {
            name: 'Player 2',
            result: 'Lose',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
    },
    {
        id: 2,
        player1: {
            name: 'Player 1',
            result: 'Win',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        player2: {
            name: 'Player 2',
            result: 'Lose',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
    },
    {
        id: 3,
        player1: {
            name: 'Player 1',
            result: 'Win',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        player2: {
            name: 'Player 2',
            result: 'Lose',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
    },
    {
        id: 4,
        player1: {
            name: 'Player 1',
            result: 'Win',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        player2: {
            name: 'Player 2',
            result: 'Lose',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
    },
    {
        id: 5,
        player1: {
            name: 'Player 1',
            result: 'Win',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        player2: {
            name: 'Player 2',
            result: 'Lose',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
    },
]
</script>

<style></style>
