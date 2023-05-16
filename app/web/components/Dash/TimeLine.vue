<template>
    <div>
        <!------
			the dropdown button
			----->
        <div class="flex items-center justify-between">
            <div class="relative inline-block text-left">
                <div>
                    <button
                        @click="handleDropdown"
                        type="button"
                        class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        id="menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        Sort
                        <svg
                            class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <!--
				Dropdown menu, show/hide based on menu state.
			  -->
                <div
                    v-if="showButton"
                    class="absolute right-0 left-100 z-10 mt-1 w-40 rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabindex="-1"
                >
                    <div class="py-1" role="none">
                        <!--
					Clicked : 'text-gray-900 font-medium focus:bg-gray-100' 
					Not Clicked : 'text-gray-500 hover:bg-gray-100'
					Shared : 'w-full text-left block px-4 py-2 text-sm focus:outline-none'
					on click previous buttn should be reset to default and current button should be clicked
				  -->

                        <button
                            @click="handleFilteration('all')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none"
                            :class="{
                                'text-gray-900 font-medium focus:bg-gray-100': isFilter.get('all'),
                                ' text-gray-500 hover:bg-gray-100': !isFilter.get('all'),
                            }"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                        >
                            Latest
                        </button>

                        <button
                            @click="handleFilteration('win')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none"
                            :class="{
                                'text-gray-900 font-medium focus:bg-gray-100': isFilter.get('win'),
                                ' text-gray-500 hover:bg-gray-100': !isFilter.get('win'),
                            }"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                        >
                            Result: Victories only
                        </button>

                        <button
                            @click="handleFilteration('lose')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none"
                            :class="{
                                'text-gray-900 font-medium focus:bg-gray-100': isFilter.get('lose'),
                                ' text-gray-500 hover:bg-gray-100': !isFilter.get('lose'),
                            }"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                        >
                            Result: Defeats only
                        </button>

                        <button
                            @click="handleFilteration('asc')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none"
                            :class="{
                                'text-gray-900 font-medium focus:bg-gray-100': isFilter.get('asc'),
                                ' text-gray-500 hover:bg-gray-100': !isFilter.get('asc'),
                            }"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                        >
                            Score: Low to High
                        </button>

                        <button
                            @click="handleFilteration('desc')"
                            class="w-full text-left block px-4 py-2 text-sm focus:outline-none"
                            :class="{
                                'text-gray-900 font-medium focus:bg-gray-100': isFilter.get('desc'),
                                ' text-gray-500 hover:bg-gray-100': !isFilter.get('desc'),
                            }"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                        >
                            Score: High to Low
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!----
		the match history component
		-->

        <!-- <div class="w-full px-2 m-2"> -->
        <!-- <div class="flex flex-row justify-between px-2 mb-2"> -->
        <!-- <div class="text-sm font-mono">Opponent 1</div>
		  <div class="text-sm font-mono">vs</div>
		  <div class="text-sm font-mono">Opponent 2</div> -->
        <!-- </div> -->
        <!-- </div> -->
        <div v-if="games.length > 0">
            <div
                v-for="game in games"
                :key="game.id"
                class="w-full px-2 rounded m-2 bg-white shadow-sm p-2"
            >
                <template v-if="!isSameLogin(game)">
                    <div class="flex flex-row justify-between w-full">
                        <div class="self-center">
                            <span class="text-xs font-light">{{
                                getLadderRank(getMe(game)?.user.ladder)
                            }}</span>
                            <img
                                :src="getMe(game)?.user.image"
                                class="w-8 h-8 rounded-full self-center"
                            />
                            <!-- name and result -->
                            <div class="flex flex-col text-center justify-center">
                                <div class="text-xs font-light">
                                    {{ getMe(game)?.user.username }}
                                </div>
                                <div
                                    v-if="getMe(game)?.IsWinner === true"
                                    class="text-xs text-green-600 font-medium"
                                >
                                    Win
                                </div>
                                <div
                                    v-else-if="getMe(game)?.IsWinner === false"
                                    class="text-xs text-red-600 font-medium"
                                >
                                    Lose
                                </div>
                            </div>
                        </div>
                        <!-- vs -->
                        <div class="flex flex-row mt-3">
                            <div class="pr-2">{{ getMe(game)?.score }}</div>
                            <div class="text-xs font-light mt-1">vs</div>
                            <div class="pl-2">{{ getOpponent(game)?.score }}</div>
                        </div>
                        <div class="flex flex-col items-center">
                            <!-- name and result -->
                            <div class="flex flex-col text-center justify-center">
                                <div class="text-xs font-light">
                                    {{ getOpponent(game)?.user.username }}
                                </div>
                                <div
                                    v-if="getOpponent(game)?.IsWinner === true"
                                    class="text-xs text-green-600 font-medium"
                                >
                                    Win
                                </div>
                                <div
                                    v-else-if="getOpponent(game)?.IsWinner === false"
                                    class="text-xs text-red-600 font-medium"
                                >
                                    Lose
                                </div>
                            </div>
                            <img
                                :src="getOpponent(game)?.user.image"
                                class="w-8 h-8 rounded-full self-center"
                            />
                            <span class="text-xs font-light">{{
                                getLadderRank(getOpponent(game)?.user.ladder)
                            }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div v-else class="flex flex-col justify-center items-center rounded">
            <div class="text-center text-gray-500">
                <div class="text-2xl font-bold">No Games Found</div>
            </div>
        </div>

        <!----
	 the pagination part 
	-->
        <Pagination @page="handlePagination" :url="totalPagesURL" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
    username: {
        type: String,
        default: false,
    },
})

const user = await getUserbyUserName(props.username)

const login = computed(() => user.login)

const game_history = await useGameHistory(`/match-history/${login.value}?page=1`)

const games: any = computed(() => {
    return game_history ? game_history.values : []
})

const showButton = ref(false)

const currentPage = ref(1)

const currentFilter = ref('all')

const isFilter = ref(new Map<string, boolean>())

const totalPagesURL = `/match-history/${login.value}/totalPages`

onMounted(async () => {
    isFilter.value.set('all', true)
    isFilter.value.set('win', false)
    isFilter.value.set('lose', false)
    isFilter.value.set('asc', false)
    isFilter.value.set('desc', false)
    currentPage.value = 1
    currentFilter.value = 'all'
    const data = await useGameHistory(`/match-history/${login.value}?page=${currentPage.value}`)
    if (data && game_history) game_history.values = data
})

const getOpponent = (game: MatchHistoryDto) => {
    return game.opponents.find((opponent: PlayerStatusDto) => opponent.user.login !== login.value)
}

const getMe = (game: MatchHistoryDto) => {
    return game.opponents.find((opponent: PlayerStatusDto) => opponent.user.login === login.value)
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
    for (const key of isFilter.value.keys()) isFilter.value.set(key, false)
    let data
    if (filter == 'all')
        data = await useGameHistory(`/match-history/${login.value}?page=${currentPage.value}`)
    else if (filter == 'win')
        data = await useGameHistory(
            `/match-history/${login.value}/result?page=${currentPage.value}&winning=true&losing=false`,
        )
    else if (filter == 'lose')
        data = await useGameHistory(
            `/match-history/${login.value}/result?page=${currentPage.value}&winning=false&losing=true`,
        )
    else if (filter == 'asc')
        data = await useGameHistory(
            `/match-history/${login.value}/score?page=${currentPage.value}&sort=asc`,
        )
    else if (filter == 'desc')
        data = await useGameHistory(
            `/match-history/${login.value}/score?page=${currentPage.value}&sort=desc`,
        )
    if (data && game_history) game_history.values = data
    currentFilter.value = filter
    isFilter.value.set(filter, true)
    console.log(filter)
}

const getLadderRank = (ladder: number | undefined) => {
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
