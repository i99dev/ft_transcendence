<template>
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-secondary shadow-primary shadow-md bg-opacity-5 py-6 px-10 rounded-lg border border-tertiary border-opacity-70 space-y-4"
    >
        <div v-if="step === 1" key="step1">
            <h2 class="text-2xl text-center text-white font-bold mb-4">Select Game Type</h2>
            <div class="space-y-2">
                <button
                    class="w-full py-2 px-2 rounded-md text-white bg-tertiary bg-opacity-75 hover:bg-opacity-100 border-1 border-white smooth-transition duration-200 ease-in-out hover:scale-105 active:scale-95"
                    @click="selectGame('classic')"
                >
                    Classic Pong
                </button>

                <button
                    class="w-full py-2 px-2 rounded-md text-white bg-primary bg-opacity-75 hover:bg-primary border-1 border-white transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                    @click="selectGame('custom')"
                >
                    Custom Pong
                </button>
            </div>
            <div class="flex justify-center mt-4">
                <button
                    class="py-2 px-4 rounded-md text-white bg-background_dark bg-opacity-75 hover:bg-opacity-100 border-1 border-white transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                    @click="goHome"
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
                        class="w-full py-2 px-4 rounded-md text-white hover:bg-opacity-100 border-1 border-white smooth-transation duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        :class="[
                            selectedMode === 'single' ? 'bg-opacity-100' : 'bg-opacity-75',
                            selectedGame === 'classic' ? 'bg-tertiary' : 'bg-primary',
                        ]"
                        @click="selectMode('single')"
                    >
                        Single Player
                    </button>
                </li>
                <li>
                    <button
                        class="w-full py-2 px-4 rounded-md text-white hover:bg-opacity-100 border-1 border-white smooth-transation duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        :class="[
                            selectedMode === 'multi' ? 'bg-opacity-100' : 'bg-opacity-75',
                            selectedGame === 'classic' ? 'bg-tertiary' : 'bg-primary',
                        ]"
                        @click="selectMode('multi')"
                    >
                        Find Opponent
                    </button>
                </li>
            </ul>

            <div v-if="selectedGame === 'custom'">
                <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
                    Pick Two PowerUps
                </h3>

                <div class="grid grid-cols-2 text-white">
                    <label
                        v-for="(powerup, index) in powerups"
                        :for="powerup"
                        :key="index"
                        class="flex items-center hover:bg-background_light rounded-xl smooth-transition p-2 cursor-pointer smooth-transition group"
                    >
                        <input
                            type="checkbox"
                            :id="powerup"
                            :value="powerup"
                            v-model="selectedPowerups"
                            @change="checkPowerupLimit"
                            class="hidden"
                        />
                        <label
                            :for="powerup"
                            class="cursor-pointer p-2 rounded-xl w-full h-full smooth-transition"
                            :class="[
                                selectedPowerups.includes(powerup) ? 'bg-secondary' : 'text-white',
                                selectedPowerups.length === 2 && !selectedPowerups.includes(powerup)
                                    ? 'opacity-70 group-hover:opacity-100 cursor-not-allowed'
                                    : '',
                            ]"
                            >{{ powerup }}</label
                        >
                    </label>
                </div>
            </div>

            <div class="mt-4 flex space-x-4 justify-center">
                <button
                    class="py-2 px-4 rounded-md text-white bg-background_dark bg-opacity-75 hover:bg-opacity-100 border-1 border-white transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    @click="step = 1"
                >
                    Back
                </button>
                <button
                    :disabled="
                        !selectedMode || (selectedGame === 'custom' && selectedPowerups.length != 2)
                    "
                    class="py-2 px-4 border-1 border-white rounded-md text-white bg-opacity-75 hover:bg-opacity-100 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    :class="[selectedGame === 'classic' ? 'bg-primary' : 'bg-tertiary']"
                    @click="emitGameSelected"
                >
                    Start Game
                </button>
            </div>
        </div>

        <div v-else-if="step === 3" class="box">
            <div class="loading-container flex flex-col items-center justify-center">
                <CommonLoading />
                <p class="loading-text mt-2 text-lg font-bold text-white">{{ loadingMsg }}</p>
                <button
                    v-if="selectedMode == 'multi'"
                    class="py-2 px-4 mt-4 rounded-md text-white bg-accent_dark bg-opacity-75 hover:bg-opacity-100 border-1 border-whitetransition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    @click="leaveQueue"
                >
                    Leave Queue
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const step = ref(1)
const selectedGame = ref('' as string)
const selectedMode = ref('' as string)
const loadingMsg = ref('' as string)
const selectedPowerups = ref<string[]>([])
const { showDublicateModal, isClientConnected } = useDublicateModal()

const emit = defineEmits(['gameSelected', 'leaveQueue'])

const selectGame = (game: string) => {
    if (!isClientConnected()) {
        showDublicateModal.value = true
        return
    }
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
