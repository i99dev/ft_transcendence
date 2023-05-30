<template>
    <div>
        <!--table-->

        <button
            v-for="(player, index) in players"
            :title="getLadderRank(player.ladder)"
            :key="index"
            @click="navigateTo(`/users/${player.username}`)"
            class="w-full h-12 rounded-2xl m-2 shadow-sm p-2 text-white border-1 smooth-transition hover:scale-105 hover:bg-tertiary"
            :class="{
                'bg-background': !(index % 2),
                'bg-background_light': index % 2,
            }"
        >
            <div
                class="min-w-full h-full text-left text-xs sm:text-sm font-light text-white grid grid-cols-3 place-content-center"
            >
                <div class="centered lg:justify-start">
                    <div
                        class="whitespace-nowrap font-medium centered p-1 m-2 sm:mr-4 h-6 sm:h-8 aspect-square bg-tertiary rounded-md sm:rounded-xl mr-2"
                    >
                        {{ player.rankNum }}
                    </div>
                    <img :src="player.image" class="h-6 aspect-square rounded-full object-cover mr-4" />
                    <!-- name and result -->
                    <div
                        class="m-2 font-bold overflow-hidden inline-block text-ellipsis whitespace-nowrap w-20 sm:w-20"
                    >
                        {{ player.username }}
                    </div>
                </div>
                <div class="whitespace-nowrap centered mobile:hidden">
                    <span class="mr-8 align-middle">{{ getLadderRank(player.ladder) }}</span>
                </div>
                <div
                    class="whitespace-nowrap mx-4 align-middle lowercase flex items-center justify-end"
                >
                    <span class="font-bold mr-1">
                        {{ player.TotalMatches }}
                    </span>
                    <span> matches </span>
                </div>
            </div>
        </button>

        <!---- Pagination ---->

        <DashPagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">

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
                rankNum: 3 * (currentPage.value - 1) + (i + 1),
                ...data.value[i],
                TotalMatches: await getPlayerGameResult(data.value[i].login),
            })
        }
    }
    lbPlayers.value = playersArray
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
