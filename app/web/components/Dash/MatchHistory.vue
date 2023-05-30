<template>
    <div class="relative">
        <!----
		the match history component
		-->
        <div v-if="games.length > 0">
            <div v-for="(game, index) in games" :key="game.id"
                class="w-full rounded-2xl m-2 bg-trasparent shadow-sm p-2 text-white border-1 smooth-transition hover:bg-secondary"
                :class="{
                    'bg-background': !(index % 2),
                    'bg-background_light': index % 2,
                }">
                <div v-if="!isSameLogin(game)">
                    <div class="grid grid-cols-3 w-full">
                        <div class="centered justify-self-start">
                            <img v-if="user.login == user_info.login" :src="user_info.image"
                                class="w-8 h-8 rounded-full object-cover" />
                            <img v-else :src="getMe(game)?.user.image" class="w-8 h-8 rounded-full object-cover" />
                            <!-- name and result -->
                            <div
                                class="text-xs m-2 font-bold overflow-hidden inline-block text-ellipsis whitespace-nowrap w-20 sm:w-20">
                                {{
                                    user.login === user_info.login
                                    ? user_info.username
                                    : getMe(game)?.user.username
                                }}
                            </div>
                        </div>
                        <!-- result -->
                        <div class="centered relative">
                            <div class="absolute left-1/4">{{ getMe(game)?.score }}</div>
                            <div class="text-xs font-bold">-</div>
                            <div class="absolute right-1/4">{{ getOpponent(game)?.score }}</div>
                        </div>
                        <div class="centered justify-self-end">
                            <!-- name and result -->
                            <div
                                class="text-xs m-2 font-bold overflow-hidden inline-block text-ellipsis whitespace-nowrap w-20 sm:w-20 text-end">
                                {{ getOpponent(game)?.user.username }}
                            </div>
                            <img :src="getOpponent(game)?.user.image" class="w-8 h-8 rounded-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-col justify-center items-center rounded">
            <div class="text-center text-white">
                <div class="text-2xl font-bold">No Games Found</div>
            </div>
        </div>

        <MainPopover :styles="'-left-24 bottom-full bg-background_light w-48'"
            class="text-white m-2 centered absolute my-3 sm:my-4 w-full">
            <template #button>
                <button @click="handleDropdown"
                    class="centered p-2 rounded-full w-full text-white hover:bg-primary smooth-transition focus:outline-none bg-background_light">
                    <ChevronUpIcon class="w-4 h-4" />
                </button>
            </template>
            <div class="m-2">
                <button @click="handleFilteration('all')"
                    class="w-full text-left block px-4 py-2 text-sm focus:outline-none smooth-transition rounded-xl whitespace-nowrap my-2 capitalize"
                    :class="{
                        'font-medium focus:bg-tertiary': isFilter.get('all'),
                        ' hover:bg-primary': !isFilter.get('all'),
                    }" role="menuitem" tabindex="-1" id="menu-item-1">
                    latest
                </button>

                <button @click="handleFilteration('asc')"
                    class="w-full text-left block px-4 py-2 text-sm focus:outline-none smooth-transition rounded-xl whitespace-nowrap my-2 capitalize"
                    :class="{
                        'font-medium focus:bg-tertiary': isFilter.get('asc'),
                        'hover:bg-primary': !isFilter.get('asc'),
                    }" role="menuitem" tabindex="-1" id="menu-item-1">
                    score: low to high
                </button>

                <button @click="handleFilteration('desc')"
                    class="w-full text-left block px-4 py-2 text-sm focus:outline-none smooth-transition rounded-xl whitespace-nowrap my-2 capitalize"
                    :class="{
                        'font-medium focus:bg-tertiary': isFilter.get('desc'),
                        'hover:bg-primary': !isFilter.get('desc'),
                    }" role="menuitem" tabindex="-1" id="menu-item-1">
                    score: high to low
                </button>

                <button @click="handleFilteration('win')"
                    class="w-full text-left block px-4 py-2 text-sm focus:outline-none smooth-transition rounded-xl whitespace-nowrap my-2 capitalize"
                    :class="{
                        'font-medium focus:bg-tertiary': isFilter.get('win'),
                        'hover:bg-primary': !isFilter.get('win'),
                    }" role="menuitem" tabindex="-1" id="menu-item-1">
                    result: victories only
                </button>

                <button @click="handleFilteration('lose')"
                    class="w-full text-left block px-4 py-2 text-sm focus:outline-none smooth-transition rounded-xl whitespace-nowrap my-2 capitalize"
                    :class="{
                        'font-medium focus:bg-tertiary': isFilter.get('lose'),
                        'hover:bg-primary': !isFilter.get('lose'),
                    }" role="menuitem" tabindex="-1" id="menu-item-1">
                    result: defeats only
                </button>
            </div>
        </MainPopover>

        <!---- the pagination part -->
        <Pagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">
import { ChevronUpIcon } from '@heroicons/vue/20/solid'

const { user_info } = useUserInfo()

const props = defineProps({
    username: {
        type: String,
        default: false,
    },
})

const user = await getUserbyUserName(props.username)

const gameHistoryRef = ref([] as MatchHistoryDto[])

const game_history = computed(() => gameHistoryRef.value)

const games: any = computed(() => {
    return game_history ? game_history.value : []
})

const showButton = ref(false)

const currentPage = ref(1)

const currentFilter = ref('all')

const isFilter = ref(
    new Map([
        ['all', true],
        ['win', false],
        ['lose', false],
        ['asc', false],
        ['desc', false],
    ]),
)

const totalPagesURL = ref(`/match/${user.login}/totalPages`)

onMounted(async () => {
    const data: MatchHistoryDto[] = (await useGameHistory(
        `/match/${user.login}?page=${currentPage.value}`,
    )) as MatchHistoryDto[]
    if (data && game_history) gameHistoryRef.value = data ? data : []
})

const getOpponent = (game: MatchHistoryDto) => {
    return game.opponents.find((opponent: PlayerStatusDto) => opponent.user.login !== user.login)
}

const getMe = (game: MatchHistoryDto) => {
    return game.opponents.find((opponent: PlayerStatusDto) => opponent.user.login === user.login)
}

const handleDropdown = () => {
    showButton.value = !showButton.value ? true : false
}

// temprorary solution for same login bug
const isSameLogin = (game: MatchHistoryDto) => {
    return game.opponents[0].user.login === game.opponents[1].user.login ? true : false
}

const handlePagination = async (page: number) => {
    currentPage.value = page
    await handleFilteration(currentFilter.value)
}

const handleFilteration = async (filter: string) => {
    for (const key of isFilter.value?.keys()) isFilter.value?.set(key, false)
    let data
    if (filter == 'all')
        data = await useGameHistory(`/match/${user.login}?page=${currentPage.value}`)
    else if (filter == 'win')
        data = await useGameHistory(
            `/match/${user.login}/result?page=${currentPage.value}&isWin=true`,
        )
    else if (filter == 'lose')
        data = await useGameHistory(
            `/match/${user.login}/result?page=${currentPage.value}&isWin=false`,
        )
    else if (filter == 'asc')
        data = await useGameHistory(`/match/${user.login}/score?page=${currentPage.value}&sort=asc`)
    else if (filter == 'desc')
        data = await useGameHistory(
            `/match/${user.login}/score?page=${currentPage.value}&sort=desc`,
        )
    if (data && game_history) gameHistoryRef.value = data ? data : []
    currentFilter.value = filter
    isFilter.value?.set(filter, true)
}
</script>
