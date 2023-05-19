<template>
    <div>
        <!--table-->

        <div
            v-for="(player, index) in players"
            :key="index"
            class="w-full px-6 rounded m-2 bg-white shadow-sm p-2"
        >
            <table class="min-w-full text-left text-sm font-light">
                <tbody>
                    <tr>
                        <td class="whitespace-nowrap px-2 py-4 font-medium">
                            {{ player.rankNum }}
                        </td>
                        <td class="whitespace-nowrap px-2 py-4">
                            <!-- <img src="https://www.pngitem.com/pimgs/m/536-5365344_icon-one-piece-png-transparent-png.png" alt="image-description" class="mr-2 w-0.3 h-20 rounded-full self-center"> -->
                            <span class="mr-8 align-middle">{{
                                getLadderRank(player.ladder)
                            }}</span>
                        </td>
                        <td class="whitespace-nowrap px-2 py-4 flex items-center">
                            <img
                                :src="player.image"
                                alt="image-description"
                                class="rounded-full border-2 flex sm:flex-row sm:h-32 h-20 sm:w-32 w-20 object-cover"
                            />
                            <span class="m-3 w-96 align-middle">{{ player.username }}</span>
                        </td>
                        <td class="whitespace-nowrap px-1 py-4 align-middle">
                            total games played {{ player.TotalMatches }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!---- Pagination ---->

        <Pagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const lbPlayers = ref([] as any)

const players = computed(() => lbPlayers.value)

const Ranknum = ref(1)

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
        if (currentPage.value === 1) Ranknum.value = 1
        for (let i = 0; i < data.value?.length; i++) {
            playersArray.push({
                rankNum: Ranknum.value + i,
                ...data.value[i],
                TotalMatches: await getPlayerGameResult(data.value[i].login, 'false', 'false'),
            })
        }
        Ranknum.value += playersArray.length
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
