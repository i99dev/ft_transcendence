import { PlayerDto } from '../../../api/src/module/game/dto/game.dto';
<template>
    <div
        class="fixed top-0 left-1/2 transform -translate-x-1/2 z-20 bg-violet-900 bg-opacity-5 py-2 px-6 rounded-b-lg shadow-lg border border-violet-700 flex items-center space-x-6"
    >
        <div class="flex flex-col items-center text-xl">
            <div class="text-white uppercase overflow-hidden w-24 font-mono text-center">
                {{ playersUsername[0] }}
            </div>
            <div class="text-white font-semibold text-2xl">{{ playersData[0].score }}</div>
        </div>
        <div class="flex space-x-4">
            <div
                v-for="(powerUp, i) in playersData[0].powerUps"
                :key="i"
                class="bg-white w-12 h-12 rounded-md border-2 border-violet-400 flex items-center justify-center relative"
                v-click-effect="() => onPowerUpClick(0, i + 1)"
            >
                <img
                    :src="`/imgs/${powerUp.type}.png`"
                    :alt="`Icon ${i + 1}`"
                    class="w-full h-full rounded-md"
                />
                <div
                    v-if="!powerUp.ready"
                    class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-md"
                ></div>
            </div>
        </div>
        <div class="border-r border-white border-opacity-50 h-8 mx-4"></div>
        <div class="flex space-x-4">
            <div
                v-for="(powerUp, i) in playersData[1].powerUps"
                :key="i"
                class="bg-white w-12 h-12 rounded-md border-2 border-violet-400 flex items-center justify-center relative"
                v-click-effect="() => onPowerUpClick(1, i + 1)"
            >
                <img
                    :src="`/imgs/${powerUp.type}.png`"
                    :alt="`Icon ${i + 1}`"
                    class="w-full h-full rounded-md"
                />
                <div
                    v-if="!powerUp.ready"
                    class="absolute inset-0 bg-gray-500 opacity-50 transition-opacity duration-500 rounded-md"
                ></div>
            </div>
        </div>
        <div class="flex flex-col items-center text-xl">
            <div class="text-white uppercase overflow-hidden w-24 font-mono text-center">
                {{ playersUsername[1] }}
            </div>
            <div class="text-white font-semibold text-2xl">{{ playersData[1].score }}</div>
        </div>
    </div>
    <button
        v-click-effect="() => $emit('ExitBtn')"
        class="fixed top-14 left-1/2 mt-2 transform -translate-x-1/2 z-20 bg-transparent text-white text-xl px-2 py-1"
    >
        <img src="/imgs/leave.png" alt="Leave Game" class="w-6 h-6" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    cooldown11: {
        type: Boolean,
        default: false,
    },
    cooldown12: {
        type: Boolean,
        default: false,
    },
    cooldown21: {
        type: Boolean,
        default: false,
    },
    cooldown22: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['ExitBtn', 'powerup'])

const gameSetup = useState<SetupDto>('gameSetup')
const gameData = useState<gameStatusDto>('gameData')
const scoreAudio = ref(new Audio('/sounds/score.mp3'))
scoreAudio.value.volume = 0.2
const playersUsername = ref<string[]>([])

watchEffect(async () => {
    let userName1
    let userName2
    if (gameSetup.value?.game.players[0].login == 'Computer') {
        userName1 = 'Computer'
    } else {
        const user = await getUserInfo(gameSetup.value?.game.players[0].login)
        userName1 = user.username
    }
    if (gameSetup.value?.game.players[1].login == 'Computer') {
        userName2 = 'Computer'
    } else {
        const user = await getUserInfo(gameSetup.value?.game.players[1].login)
        userName2 = user.username
    }

    playersUsername.value = [userName1, userName2]
})
const playersData = computed(() => {
    return [
        {
            score: gameData.value?.players?.[0]?.score,
            powerUps: gameData.value?.players?.[0]?.powerUps,
        },
        {
            score: gameData.value?.players?.[1]?.score,
            powerUps: gameData.value?.players?.[1]?.powerUps,
        },
    ]
})

onMounted(() => {})

const onPowerUpClick = (player: number, powerup: number) => {
    if (gameSetup.value.player == player) {
        emit('powerup', powerup.toString())
    }
}

watch(playersData, ([newPlayer1, newPlayer2], [oldPlayer1, oldPlayer2]) => {
    if (newPlayer1.score !== 11 && newPlayer1.score !== oldPlayer1.score) {
        scoreAudio.value.play()
    }
    if (newPlayer2.score !== 11 && newPlayer2.score !== oldPlayer2.score) {
        scoreAudio.value.play()
    }
})
</script>
