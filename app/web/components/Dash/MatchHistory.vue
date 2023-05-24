<template>
    <div>
        <!------
			the dropdown button
			----->
        <div class="flex items-center justify-between">
            <div class="relative inline-block text-left">
                <div>
                    <button v-click-effect="handleDropdown" type="button"
                        class="group inline-flex justify-center text-sm font-medium text-white hover:bg-primary p-1 rounded-lg"
                        id="menu-button" aria-expanded="false" aria-haspopup="true">
                        <svg class="h-5 w-5 flex-shrink-0 text-white group-hover:bg-primary mr-2" viewBox="0 0 20 20"
                            fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd" />
                        </svg>
                        Sort
                    </button>
                </div>

                <!--
				Dropdown menu, show/hide based on menu state.
			  -->
                <div v-if="showButton"
                    class="absolute right-0 left-100 z-10 mt-1 w-40 rounded-md bg-background border-1 border-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-white"
                    role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    <div class="py-1" role="none">
                        <button v-click-effect="()=> handleFilteration('all')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{
                                'font-medium focus:bg-white': isFilter.get('all'),
                                ' hover:bg-white': !isFilter.get('all'),
                            }" role="menuitem" tabindex="-1" id="menu-item-1">
                            Latest
                        </button>

                        <button v-click-effect="()=> handleFilteration('win')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{
                                'font-medium focus:bg-white': isFilter.get('win'),
                                'hover:bg-white': !isFilter.get('win'),
                            }" role="menuitem" tabindex="-1" id="menu-item-1">
                            Result: Victories only
                        </button>

                        <button v-click-effect="()=> handleFilteration('lose')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{
                                'font-medium focus:bg-white': isFilter.get('lose'),
                                'hover:bg-white': !isFilter.get('lose'),
                            }" role="menuitem" tabindex="-1" id="menu-item-1">
                            Result: Defeats only
                        </button>

                        <button v-click-effect="()=> handleFilteration('asc')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{
                                'font-medium focus:bg-white': isFilter.get('asc'),
                                'hover:bg-white': !isFilter.get('asc'),
                            }" role="menuitem" tabindex="-1" id="menu-item-1">
                            Score: Low to High
                        </button>

                        <button v-click-effect="()=> handleFilteration('desc')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{
                                'font-medium focus:bg-white': isFilter.get('desc'),
                                'hover:bg-white': !isFilter.get('desc'),
                            }" role="menuitem" tabindex="-1" id="menu-item-1">
                            Score: High to Low
                        </button>
                    </div>
                </div>
            </div>
        </div>

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
                            <div v-if="user.login == user_info.login" class="text-xs m-2 capitalize font-bold"> {{
                                user_info.username }} </div>
                            <div v-else class="text-xs m-2 capitalize font-bold"> {{ getMe(game)?.user.username }} </div>
                        </div>
                        <!-- result -->
                        <div class="centered relative">
                            <div class="absolute left-1/4">{{ getMe(game)?.score }}</div>
                            <div class="text-xs font-bold">-</div>
                            <div class="absolute right-1/4">{{ getOpponent(game)?.score }}</div>
                        </div>
                        <div class="centered justify-self-end">
                            <!-- name and result -->
                            <div class="text-xs m-2 capitalize font-bold"> {{ getOpponent(game)?.user.username }} </div>
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

        <!---- the pagination part -->
        <Pagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

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

const isFilter = ref(new Map([
    ['all', true],
    ['win', false],
    ['lose', false],
    ['asc', false],
    ['desc', false],
]));

const totalPagesURL = ref(`/match/${user.login}/totalPages`)

onMounted(async () => {
    const data: MatchHistoryDto[] = await useGameHistory(`/match/${user.login}?page=${currentPage.value}`) as MatchHistoryDto[]
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
        data = await useGameHistory(
            `/match/${user.login}/score?page=${currentPage.value}&sort=asc`,
        )
    else if (filter == 'desc')
        data = await useGameHistory(
            `/match/${user.login}/score?page=${currentPage.value}&sort=desc`,
        )
    if (data && game_history) gameHistoryRef.value = data ? data : []
    currentFilter.value = filter
    isFilter.value?.set(filter, true)
}

</script>
