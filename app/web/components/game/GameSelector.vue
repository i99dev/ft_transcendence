<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white p-6 rounded-lg shadow-lg relative w-full ">
        <div class="aspect-w-3 aspect-h-4">
            <div>
              <div v-if="step === 1" key="step1">
                <h2 class="text-2xl mb-4 text-center">Select a Game</h2>
                <ul class="space-y-2">
                  <li>
                    <button
                      class="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-blue-600"
                      @click="selectGame('classic')"
                    >
                      Classic Pong
                    </button>
                  </li>
                  <li>
                    <button
                      class="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-blue-600"
                      @click="selectGame('custom')"
                    >
                      Custom Pong
                    </button>
                  </li>
                </ul>
              </div>
              <div v-if="step === 2" key="step2">
                <h2 class="text-2xl mb-4 text-center">Select Game Mode</h2>
                <ul class="space-y-2">
                  <li>
                    <button
                      :class="selectedMode === 'single' ? 'bg-green-500' : 'bg-blue-500'"
                      class="w-full py-2 px-4 border border-transparent rounded-md text-white hover:bg-blue-600"
                      @click="selectMode('single')"
                    >
                      Single Player
                    </button>
                  </li>
                  <li>
                    <button
                      :class="selectedMode === 'multi' ? 'bg-green-500' : 'bg-blue-500'"
                      class="w-full py-2 px-4 border border-transparent rounded-md text-white hover:bg-blue-600"
                      @click="selectMode('multi')"
                    >
                      Find Opponent
                    </button>
                  </li>
                </ul>
                <div class="mt-4 flex space-x-4 justify-center">
                  <button
                    class="py-2 px-4 border border-transparent rounded-md text-white bg-blue-700 hover:bg-blue-800"
                    @click="step = 1"
                  >
                    Back
                  </button>
                  <button
                    :disabled="!selectedMode"
                    class="py-2 px-4 border border-transparent rounded-md text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
                    @click="emitGameSelected"
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
                  <p class="loading-text mt-2 text-lg font-bold">{{ loadingMsg }}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">


const step = ref(1);
const selectedGame = ref('' as string);
const selectedMode = ref('' as string);
const loadingMsg = ref('' as string);

const emit = defineEmits(['gameSelected'])

const selectGame = (game : string) => {
  selectedGame.value = game;
  step.value = 2;
};

const reset = (game : string) => {
  step.value = 1
  selectedGame.value = ''
  selectedMode.value = ''
};

defineExpose({ reset });

const selectMode = (mode : string) => {
  selectedMode.value = mode;
};

const emitGameSelected = () => {
    emit('gameSelected', { gameType: selectedGame.value, gameMode: selectedMode.value});
    if(selectedMode.value === 'single') {
      loadingMsg.value = 'Creating Game...';
    } else {
      loadingMsg.value = 'Finding Opponent...';
    }
    step.value = 3;
};
</script>
  
<style scoped>
  .half-circle-spinner, .half-circle-spinner * {
    box-sizing: border-box;
  }

  .half-circle-spinner {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    position: relative;
  }

  .half-circle-spinner .circle {
    content: "";
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
    100%{
      transform: rotate(360deg);
    }
  }
</style>
  