<template>
	<div>
	  <div class="w-full px-2 m-2">
		<div class="flex flex-row justify-between px-2 mb-2">
		  <!-- <div class="text-sm font-mono">Opponent 1</div>
		  <div class="text-sm font-mono">vs</div>
		  <div class="text-sm font-mono">Opponent 2</div> -->
		</div>
	  </div>
	  <div class="">
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
	</div>
 </template>
  
<script setup>
const game_history = await useGameHistory()

const games = computed(() => game_history)

const getOpponent = (game) => {
  return game.opponents.find((opponent) => opponent.user.login !== 'aaljaber')
}

const getMe = (game) => {
  return game.opponents.find((opponent) => opponent.user.login === 'aaljaber')
}


// console.log(games)
</script>

<style></style>
