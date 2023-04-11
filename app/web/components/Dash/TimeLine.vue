<template>
	<div>

		<!------
			the dropdown button
			----->
		<div class="flex items-center justify-between">
			<div class="relative inline-block text-left">
			  <div>
				<button @click="handleDropdown" type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="menu-button" aria-expanded="false" aria-haspopup="true">
				  Sort
				  <svg class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
				  </svg>
				</button>
			  </div>
  
			  <!--
				Dropdown menu, show/hide based on menu state.
			  -->
			  <div v-if="showButton" class="absolute right-0 left-100 z-10 mt-1 w-40 rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
				<div class="py-1" role="none">
				  <!--
					Clicked : 'text-gray-900 font-medium focus:bg-gray-100' 
					Not Clicked : 'text-gray-500 hover:bg-gray-100'
					Shared : 'w-full text-left block px-4 py-2 text-sm focus:outline-none'
					on click previous buttn should be reset to default and current button should be clicked
				  -->
				  
				  
				  <button @click="handleFilteration('all')" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[0] , ' text-gray-500 hover:bg-gray-100':!isClicked[0]}" role="menuitem" tabindex="-1" id="menu-item-1">Latest</button>
				 
				  <button @click=" handleFilteration('win')" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[1] , ' text-gray-500 hover:bg-gray-100':!isClicked[1]}" role="menuitem" tabindex="-1" id="menu-item-1">Result: Victories only</button>
				 
				  <button @click="handleFilteration('lose')" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[2] , ' text-gray-500 hover:bg-gray-100':!isClicked[2]}" role="menuitem" tabindex="-1" id="menu-item-1">Result: Defeats only </button>
				 
				  <button @click="handleFilteration('asc')" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[3] , ' text-gray-500 hover:bg-gray-100':!isClicked[3]}" role="menuitem" tabindex="-1" id="menu-item-1">Score: Low to High</button>
				 
				  <button @click="handleFilteration('desc')" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[4] , ' text-gray-500 hover:bg-gray-100':!isClicked[4]}" role="menuitem" tabindex="-1" id="menu-item-1">Score: High to Low</button>

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
		  <div class="flex flex-row justify-between w-full">
			<div class="self-center">
				<img
				  :src="getMe(game).user.image"
				  class="w-8 h-8 rounded-full self-center"
				/>
				<!-- name and result -->
				<div class="flex flex-col text-center justify-center">
				  <div class="text-xs font-light">
					{{ getMe(game).user.username }}
				  </div>
				  <div
					v-if="getMe(game).IsWinner === true"
					class="text-xs text-green-600 font-medium"
				  >
					Win
				  </div>
				  <div
					v-else-if="getMe(game).IsWinner === false"
					class="text-xs text-red-600 font-medium"
				  >
					Lose
				  </div>
			  </div>
			</div>
			<!-- vs -->
			<div class="flex flex-row mt-3">
				<div class="pr-2">{{ getMe(game).score }}</div>
				<div class="text-xs font-light mt-1">vs</div>
				<div class="pl-2">{{ getOpponent(game).score }}</div>
			  </div>
			<div class="flex flex-col items-center">
				<!-- name and result -->
				<div class="flex flex-col text-center justify-center">
				  <div class="text-xs font-light">
					{{ getOpponent(game).user.username }}
				  </div>
				  <div
					v-if="getOpponent(game).IsWinner === true"
					class="text-xs text-green-600 font-medium"
				  >
					Win
				  </div>
				  <div
					v-else-if="getOpponent(game).IsWinner === false"
					class="text-xs text-red-600 font-medium"
				  >
					Lose
				  </div>
				</div>
				<img
				  :src="getOpponent(game).user.image"
				  class="w-8 h-8 rounded-full self-center"
				/>
			  </div>
			</div>
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
	  <div class="w-full items-center bg-white px-4 py-3 sm:px-6 rounded m-2 shadow-sm p-2">
		<div class="flex flex-1 justify-between sm:hidden">
		  <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
		  <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
		</div>

		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
		  <div>
			<p class="text-sm text-gray-700">
			  Showing
			  <span class="font-medium">1</span>
			  to
			  <span class="font-medium">10</span>
			  of
			  <span class="font-medium">97</span>
			  results
			</p>
		  </div>

		  <div>

			<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
			  
			<button @click="handlePagination(currentPage - 1)" type="button" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
				<span class="sr-only">Previous</span>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
				</svg>
			</button>

			  <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
			  <div>
				<button v-for="pageNumber in pageNumbers" :key="pageNumber" @click="handlePagination(pageNumber)" type="button" aria-current="page" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20" :class="{ 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : isClicked2[pageNumber], ' text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50  focus:outline-offset-0' : !isClicked2[pageNumber]}">
					{{ pageNumber }}
				  </button>
			  </div>

			  <button @click="handlePagination(currentPage + 1)" type="button" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">	
				<span class="sr-only">Next</span>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
				</svg>
			  </button>

			</nav>

		  </div>
		</div>

	  </div>
	
	</div>
 </template>
  
<script setup>

import { ref, computed, onMounted } from 'vue'

const game_history = await useGameHistory(`/match-history?page=1`)

const games = computed(() => game_history.values)

const showButton = ref(false)

const isClicked = ref(Array(5).fill(false))

const currentPage = ref(1)

onMounted(async () => {
	currentPage.value = 1
	game_history.values = await useGameHistory(`/match-history?page=${currentPage.value}`)
	isClicked2.value[1] = true
})

const getOpponent = (game) => {
  return game.opponents.find((opponent) => opponent.user.login !== 'aaljaber')
}

const getMe = (game) => {
  return game.opponents.find((opponent) => opponent.user.login === 'aaljaber')
}

const handleDropdown = () => {
  showButton.value = !showButton.value? true : false
}

const pageNumbers = computed(() => {
	const pages = [];
	for (let i = 1; i <= 5; i++)
		pages.push(i);
	return pages;
});

const isClicked2 = ref(Array(5).fill(false))

const handlePagination = async (page) => {
	if (page < 1 || page > 5) return
	isClicked2.value.fill(false, 0, 6)
	isClicked2.value[page] = true
	currentPage.value = page
	game_history.values = await useGameHistory(`/match-history?page=${page}`)

}

const handleFilteration = async (filter) => {
	isClicked.value.fill(false, 0, 5)
	if (filter == "all") {
		game_history.values = await useGameHistory(`/match-history?page=${currentPage.value}`)
		isClicked.value[0] = true
	} else if (filter == "win") {
		game_history.values = await useGameHistory(`/match-history/result?page=${currentPage.value}&winning=true&losing=false`)
		isClicked.value[1] = true
	} else if (filter == "lose") {
		game_history.values = await useGameHistory(`/match-history/result?page=${currentPage.value}&winning=false&losing=true`)
		isClicked.value[2] = true
	} else if (filter == "asc"){
		game_history.values = await useGameHistory(`/match-history/score?page=${currentPage.value}&sort=asc`)
		isClicked.value[3] = true
	} else if (filter == "desc"){
		game_history.values = await useGameHistory(`/match-history/score?page=${currentPage.value}&sort=desc`)
		isClicked.value[4] = true
	}
	console.log(filter)
}

</script>
