<template>
    <div>
        <!--table-->

        <button
            v-for="(player, index) in players"
            :key="index"
            v-click-effect="()=> navigateTo(`/users/${player.username}`)"
            class="w-full h-20 rounded-2xl m-2 shadow-sm p-2 text-white border-1 smooth-transition hover:scale-105 hover:bg-tertiary"
            :class="{
                'bg-background': !(index % 2),
                'bg-background_light': index % 2,
            }"
        >
            <div class="min-w-full text-left text-sm font-light text-white grid grid-cols-3">
                <div class="centered justify-self-start">
                    <div
                        class="whitespace-nowrap font-medium p-1 m-2 w-8 aspect-square bg-tertiary rounded-xl text-center mr-4"
                    >
                        {{ player.rankNum }}
                    </div>
                    <img :src="player.image" class="w-8 h-8 rounded-full object-cover" />
                    <!-- name and result -->
                    <div class="text-xs m-2 capitalize font-bold">
                        {{ player.username }}
                    </div>
                </div>
                <div class="whitespace-nowrap px-2 py-4 justify-self-center">
                    <span class="mr-8 align-middle">{{ getLadderRank(player.ladder) }}</span>
                </div>
                <div class="whitespace-nowrap px-1 py-4 align-middle uppercase justify-self-center">
                    <span class="font-bold text-xl">
                        {{ player.TotalMatches }}
                    </span>
                    wins
                </div>
            </div>
        </button>

        <!---- Pagination ---->

        <Pagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const lbPlayers = ref([] as any)

const players = computed(() => lbPlayers.value)

const currentPage = ref(1)

const totalPagesURL = `/leaderboard/totalPages`

onMounted(async () => {
    await getLB()
})

const handlePagination = async (page: number) => {
    currentPage.value = page
    await getLB()
}

const getLB = async () => {
    const { data } = await useFetch<any[]>(`/leaderboard?page=${currentPage.value}`, {
        method: 'GET',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const playersArray = []
    if (data.value) {
        for (let i = 0; i < data.value?.length; i++) {
            playersArray.push({
                rankNum: (3 * (currentPage.value - 1)) + (i + 1),
                ...data.value[i],
                TotalMatches: await getPlayerGameResult(data.value[i].login),
            })
        }
    }
    if (data.value) lbPlayers.value = playersArray
}

const getLadderRank = (ladder: number) => {
    switch (ladder) {
        case 1:
            return 'Kaizoku Ou'
        case 2:
            return 'Yonkou'
        case 3:
            return 'Shichibukai'
        case 4:
            return 'Super Rookie'
        case 5:
            return 'Kaizoku'
        case 6:
            return 'Capin Boy'
    }
}
</script>

<style></style>
