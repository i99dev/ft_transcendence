<template>
  <div
    class="fixed top-0 left-1/2 transform -translate-x-1/2 z-20 bg-violet-900 bg-opacity-5 py-2 px-6 rounded-b-lg shadow-lg border border-violet-700 flex items-center space-x-8">
    <div class="flex flex-col items-center">
      <div class="text-white font-bold">{{ gameSetup.game.players[0].username }}</div>
      <div class="text-white font-bold">{{ scores[0] }}</div>
    </div>
    <div class="flex space-x-4">
      <div class="bg-white w-10 h-10 rounded-full flex items-center justify-center relative">
        <img src="/Hiken.jpg" alt="Icon 1" class="w-full h-full rounded-full" />
        <div v-if="cooldown11"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-full"></div>
      </div>
      <div class="bg-white w-10 h-10 rounded-full flex items-center justify-center relative">
        <img src="/Ghost.png" alt="Icon 1" class="w-full h-full rounded-full" />
        <div v-if="cooldown12"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-full"></div>
      </div>
    </div>
    <div class="border-r border-white border-opacity-50 h-8 mx-4"></div>
    <div class="flex space-x-4">
      <div class="bg-white w-10 h-10 rounded-full flex items-center justify-center relative">
        <img src="/Ghost.png" alt="Icon 1" class="w-full h-full rounded-full" />
        <div v-if="cooldown22"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-full"></div>
      </div>
      <div class="bg-white w-10 h-10 rounded-full flex items-center justify-center relative">
        <img src="/Hiken.jpg" alt="Icon 1" class="w-full h-full rounded-full" />
        <div v-if="cooldown21"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-full"></div>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="text-white font-bold">{{ gameSetup.game.players[1].username }}</div>
      <div class="text-white font-bold">{{ scores[1] }}</div>
    </div>
  </div>
  <button @click="$emit('ExitBtn')"
    class="fixed top-14 left-1/2 transform -translate-x-1/2 z-20 bg-transparent text-white text-xl px-2 py-1">
    <img src="/leave.png" alt="Leave Game" class="w-6 h-6" />
  </button>
</template>

<script setup lang='ts'>
const props = defineProps({
  cooldown11: {
    type: Boolean,
    default: false
  },
  cooldown12: {
    type: Boolean,
    default: false
  },
  cooldown21: {
    type: Boolean,
    default: false
  },
  cooldown22: {
    type: Boolean,
    default: false
  },
  player1: {
    type: String,
    default: ''
  },
  player2: {
    type: String,
    default: ''
  },
});

defineEmits(['ExitBtn'])
const usernames = ref(['', ''] as string[]);
const scores = ref([0, 0] as number[]);
const scoreAudio = new Audio('/score.mp3')
scoreAudio.volume = 0.2

let gameSetup = ref(useState<SetupDto>('gameSetup'))
let gameData = ref(useState<gameStatusDto>('gameData'))

watch(gameSetup, (newVal) => {
});

watchEffect(() => {
  if (gameData?.value?.players) {
    const newScores = [gameData.value.players[0].score, gameData.value.players[1].score];
    if (scores.value[0] != newScores[0] || scores.value[1] != newScores[1]) {
      scores.value = newScores;
      scoreAudio.play()
    }
  }
});

</script>

