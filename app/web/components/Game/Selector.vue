<template>
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-violet-900 bg-opacity-5 py-6 px-10 rounded-lg shadow-lg border border-violet-700 space-y-4"
    >
        <div v-if="step === 1" key="step1">
            <h2 class="text-2xl text-center text-white font-bold mb-4">Select Game Type</h2>
            <ul class="space-y-2 list-none">
                <li>
                    <button
                        class="w-full py-2 px-4 rounded-md text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        v-click-effect="() => selectGame('classic')"
                    >
                        Classic Pong
                    </button>
                </li>
                <li>
                    <button
                        class="w-full py-2 px-4 rounded-md text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        v-click-effect="() => selectGame('custom')"
                    >
                        Custom Pong
                    </button>
                </li>
            </ul>
            <div class="flex justify-center mt-4">
                <button
                    class="py-2 px-4 rounded-md text-white bg-red-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-red-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    v-click-effect:unplay="goHome"
                >
                    Home
                </button>
            </div>
        </div>

        <div v-if="step === 2" key="step2">
            <h2 class="text-2xl text-center text-white font-bold mb-4">Select Game Mode</h2>
            <ul class="space-y-2 list-none">
                <li>
                    <button
                        :class="selectedMode === 'single' ? 'bg-green-500' : 'bg-blue-500'"
                        class="w-full py-2 px-4 rounded-md text-white bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        v-click-effect="() => selectMode('single')"
                    >
                        Single Player
                    </button>
                </li>
                <li>
                    <button
                        :class="selectedMode === 'multi' ? 'bg-green-500' : 'bg-blue-500'"
                        class="w-full py-2 px-4 rounded-md text-white bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        v-click-effect="() => selectMode('multi')"
                    >
                        Find Opponent
                    </button>
                </li>
            </ul>

            <div v-if="selectedGame === 'custom'">
                <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
                    Pick Two PowerUps
                </h3>
                <h3 class="text-s text-white text-center mb-2">
                    Powerups can be used with buttons 1, 2
                </h3>
                <div class="grid grid-cols-2 gap-2 text-white">
                    <div
                        v-for="(powerup, index) in powerups"
                        :key="index"
                        class="flex items-center"
                    >
                        <input
                            type="checkbox"
                            :id="powerup"
                            :value="powerup"
                            v-model="selectedPowerups"
                            @change="checkPowerupLimit"
                            class="form-checkbox text-blue-500"
                        />
                        <label :for="powerup" class="ml-2">{{ powerup }}</label>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex space-x-4 justify-center">
                <button
                    class="py-2 px-4 border-2 border-blue-700 rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    v-click-effect="() => (step = 1)"
                >
                    Back
                </button>
                <button
                    :disabled="
                        !selectedMode || (selectedGame === 'custom' && selectedPowerups.length != 2)
                    "
                    class="py-2 px-4 border-2 border-blue-700 rounded-md text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    v-click-effect="emitGameSelected"
                >
                    Start Game
                </button>
            </div>
        </div>

        <div v-else-if="step === 3" class="box">
            <div class="loading-container flex flex-col items-center justify-center">
                <div class="half-circle-spinner">
                    <div class="circle circle-1"></div>
                    <div class="circle circle-2"></div>
                </div>
                <p class="loading-text mt-2 text-lg font-bold text-white">{{ loadingMsg }}</p>
                <button
                    v-if="selectedMode == 'multi'"
                    class="py-2 px-4 mt-4 rounded-md text-white bg-red-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-red-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    v-click-effect="leaveQueue"
                >
                    Leave Queue
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const step = ref(1)
const selectedGame = ref('' as string)
const selectedMode = ref('' as string)
const loadingMsg = ref('' as string)
const selectedPowerups = ref<string[]>([])

const emit = defineEmits(['gameSelected', 'leaveQueue'])

const selectGame = (game: string) => {
    selectedGame.value = game
    step.value = 2
}

const reset = () => {
    step.value = 1
    selectedGame.value = ''
    selectedMode.value = ''
    selectedPowerups.value = []
}

const selectMode = (mode: string) => {
    selectedMode.value = mode
}

const checkPowerupLimit = () => {
    if (selectedPowerups.value?.length > 2) {
        selectedPowerups.value?.shift()
    }
}

const goHome = () => {
    navigateTo('/')
}

const leaveQueue = () => {
    emit('leaveQueue')
    reset()
}

const emitGameSelected = () => {
    emit('gameSelected', {
        gameType: selectedGame.value,
        gameMode: selectedMode.value,
        powerups: selectedGame.value === 'custom' ? selectedPowerups.value : [],
    })

    if (selectedMode.value === 'single') {
        loadingMsg.value = 'Creating Game...'
    } else {
        loadingMsg.value = 'Finding Opponent...'
    }
    step.value = 3
}

defineExpose({ reset })

const powerups = ['Hiken', 'Baika no Jutsu', 'Shinigami', 'Shunshin no Jutsu']
</script>

<style scoped>
.half-circle-spinner,
.half-circle-spinner * {
    box-sizing: border-box;
}

.half-circle-spinner {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    position: relative;
}

.half-circle-spinner .circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
    border-top-color: #ff1d5e;
    animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
    border-bottom-color: #00b6e9;
    animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
