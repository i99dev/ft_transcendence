<template>
  <div
    class="fixed top-0 left-1/2 transform -translate-x-1/2 z-20 bg-violet-900 bg-opacity-5 py-2 px-6 rounded-b-lg shadow-lg border border-violet-700 flex items-center space-x-6">
    <div class="flex flex-col items-center text-xl">
      <div class="text-white  uppercase">{{ players[0].username }}</div>
      <div class="text-white font-semibold text-2xl">{{ players[0].score }}</div>
    </div>
    <div class="flex space-x-4">
      <div v-for="(powerUp, i) in players[0].powerUps" :key="i" class="bg-white w-12 h-12 rounded-md border-2 border-violet-400 flex items-center justify-center relative">
        <img :src="`/imgs/${powerUp.type}.png`" :alt="`Icon ${i + 1}`" class="w-full h-full rounded-md" />
        <div v-if="!powerUp.ready"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-md"></div>
      </div>
    </div>
    <div class="border-r border-white border-opacity-50 h-12 mx-4"></div>
    <div class="flex space-x-4">
      <div v-for="(powerUp, i) in players[1].powerUps" :key="i" class="bg-white w-12 h-12 rounded-md border-2 border-violet-400 flex items-center justify-center relative">
        <img :src="`/imgs/${powerUp.type}.png`" :alt="`Icon ${i + 1}`" class="w-full h-full rounded-md" />
        <div v-if="!powerUp.ready"
          class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-md"></div>
      </div>
    </div>
    <div class="flex flex-col items-center text-xl">
      <div class="text-white uppercase">{{ players[1].username }}</div>
      <div class="text-white font-semibold text-2xl">{{ players[1].score }}</div>
    </div>
  </div>
  <button @click="$emit('ExitBtn')"
    class="fixed top-14 left-1/2 mt-2 transform -translate-x-1/2 z-20 bg-transparent text-white text-xl px-2 py-1">
    <img src="/imgs/leave.png" alt="Leave Game" class="w-6 h-6" />
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
});

defineEmits(['ExitBtn'])

const gameSetup = useState<SetupDto>('gameSetup');
const gameData = useState<gameStatusDto>('gameData');
const scoreAudio = new Audio('/sounds/score.mp3');
scoreAudio.volume = 0.2;

const players = computed(() => {
  return [
    {
      username: gameSetup.value?.game?.players?.[0]?.username,
      score: gameData.value?.players?.[0]?.score,
      powerUps: gameData.value?.players?.[0]?.powerUps,
    },
    {
      username: gameSetup.value?.game?.players?.[1]?.username,
      score: gameData.value?.players?.[1]?.score,
      powerUps: gameData.value?.players?.[1]?.powerUps,
    }
  ];
});

onMounted(() => {
});

watch(players, ([newPlayer1, newPlayer2], [oldPlayer1, oldPlayer2]) => {
  if (newPlayer1.score !== 11 && newPlayer1.score !== oldPlayer1.score) {
    scoreAudio.play();
  }
  if (newPlayer2.score !== 11 && newPlayer2.score !== oldPlayer2.score) {
    scoreAudio.play();
  }
})
</script>