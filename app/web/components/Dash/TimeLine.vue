<template>
	<div>

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
				  
				  
				  <button @click="handleFilteration(0, `/match-history`)" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[0] , ' text-gray-500 hover:bg-gray-100':!isClicked[0]}" role="menuitem" tabindex="-1" id="menu-item-1">Latest</button>
				 
				  <button @click=" handleFilteration(1, `/match-history/result?winning=true&losing=false`)" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[1] , ' text-gray-500 hover:bg-gray-100':!isClicked[1]}" role="menuitem" tabindex="-1" id="menu-item-1">Result: Victories only</button>
				 
				  <button @click="handleFilteration(2, `/match-history/result?winning=false&losing=true`)" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[2] , ' text-gray-500 hover:bg-gray-100':!isClicked[2]}" role="menuitem" tabindex="-1" id="menu-item-1">Result: Defeats only </button>
				 
				  <button @click="handleFilteration(3, `/match-history/score?sort=asc`)" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[3] , ' text-gray-500 hover:bg-gray-100':!isClicked[3]}" role="menuitem" tabindex="-1" id="menu-item-1">Score: Low to High</button>
				 
				  <button @click="handleFilteration(4, `/match-history/score?sort=desc`)" class="w-full text-left block px-4 py-2 text-sm focus:outline-none" :class="{'text-gray-900 font-medium focus:bg-gray-100': isClicked[4] , ' text-gray-500 hover:bg-gray-100':!isClicked[4]}" role="menuitem" tabindex="-1" id="menu-item-1">Score: High to Low</button>

				</div>
			  </div>
			</div>
		</div>
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
	  <div v-else class="flex flex-col justify-center items-center">
		<div class="text-center text-gray-500">
		  <div class="text-2xl font-bold">No Games Found</div>
		</div>
	  </div>
	</div>
 </template>
  
<script setup>

import { ref, computed, onMounted } from 'vue'

const game_history = await useGameHistory('/match-history')

const games = computed(() => game_history.values)

const showButton = ref(false)

const isClicked = ref(Array(5).fill(false))

onMounted(async () => {
	game_history.values = await useGameHistory('/match-history')
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

const handleFilteration = async (filter, ep_URL) => {
  console.log(filter)
  isClicked.value.fill(false, 0, 5)
  isClicked.value[filter] = true
  game_history.values = await useGameHistory(ep_URL)
  
}

</script>
