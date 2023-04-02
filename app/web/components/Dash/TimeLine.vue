<template>
    <div>
        <div class="w-full px-2 m-2">
            <div class="flex flex-row justify-between px-2 mb-2">
                <div class="text-sm font-mono">PLayer 1</div>
                <div class="text-sm font-mono">vs</div>
                <div class="text-sm font-mono">Player 2</div>
            </div>
        </div>
        <div class="">
            <div
                v-for="game in games"
                :key="game.id"
                class="w-full px-2 rounded m-2 bg-white shadow-sm p-2"
            >
                <div class="flex flex-row justify-between w-full">
                    <div class="self-center">
                        <div class="flex flex-row space-x-2">
                            <img
                                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                                class="w-8 h-8 rounded-full self-center"
                            />
                            <!-- name and result -->
                            <div class="flex flex-col text-center justify-center">
                                <div class="text-xs font-light">
                                    {{ game?.player1?.user?.username }}
                                </div>
                                <div class="text-xs text-green-600 font-medium">Win</div>
                            </div>
                        </div>
                    </div>
                    <!-- vs -->
                    <div class="flex flex-row">
                        <div>{{ game?.player1?.score }}</div>
                        <div class="text-xs font-light">vs</div>
                        <div>{{ game?.player2?.score }}</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="flex flex-row space-x-4">
                            <!-- name and result -->
                            <div class="flex flex-col text-center justify-center">
                                <div class="text-xs font-light">
                                    {{ game?.player2?.user?.username }}
                                </div>
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
    </div>
</template>

<script setup>
const { game_history } = useGameHistory()

const games = computed(() => game_history.value.games)
</script>

<style></style>
