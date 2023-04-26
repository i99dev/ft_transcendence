<template>
	<div>

		<!--table-->

		<div v-for="(player, index) in players" :key="index" class="w-full px-6 rounded m-2 bg-white shadow-sm p-2">
			<table class="min-w-full text-left text-sm font-light">
				<tbody>
					<tr>
						<td class="whitespace-nowrap px-2 py-4 font-medium">{{ index + 1 }}</td>
						<td class="whitespace-nowrap px-2 py-4">
							<!-- <img src="https://www.pngitem.com/pimgs/m/536-5365344_icon-one-piece-png-transparent-png.png" alt="image-description" class="mr-2 w-0.3 h-20 rounded-full self-center"> -->
							<span class="mr-8 align-middle">{{ getLadderRank(player.ladder) }}</span>
						</td>
						<td class="whitespace-nowrap px-2 py-4 flex items-center">
							<img :src=player.image alt="image-description" class="mr-2 w-0.3 h-20 rounded-full self-center">
							<span class="w-96 align-middle">{{ player.username }}</span>
						</td>
						<td class="whitespace-nowrap px-1 py-4 align-middle"> total games played {{ player.TotalMatches }} </td>
					</tr>
				</tbody>
			</table>
		</div>
		

		<!---- Pagination ---->

		<div class="w-full items-center bg-white px-4 py-3 sm:px-6 rounded m-2 shadow-sm p-2">
			<div class="flex flex-1 justify-between sm:hidden">
			  <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
			  <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
			</div>
	
			<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			  <div>
				<p class="text-sm text-gray-700">
				  Showing
				  <span class="font-medium"> {{ currentPage }}</span>
				  of
				  <span class="font-medium"> {{ pageNumber }} </span>
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
					<button v-for="pageNumber in isPage.keys()" :key="pageNumber" @click="handlePagination(pageNumber)" type="button" aria-current="page" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20" :class="{ 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : isPage.get(pageNumber), ' text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50  focus:outline-offset-0' : !isPage.get(pageNumber)}">
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

<script setup lang="ts">
import { arrayBuffer } from 'stream/consumers'
import { ref, onMounted, computed } from 'vue'

const isPage = ref(new Map<number, boolean>())

const pageNumber = ref(0)

const currentPage = ref(1)

const lbPlayers = ref([] as any)

const players = computed(() => lbPlayers.value)

onMounted(async () => {
	const totalPages = await getLBTotalPages()
	if (totalPages) pageNumber.value = totalPages
	for (let i = 1; i <= pageNumber.value; i++)
		isPage.value.set(i, false);
	isPage.value.set(1, true)
	await getLB()
})

const handlePagination = async (page: number) => {
	if (page < 1 || page > pageNumber.value) return
	for (const key of isPage.value.keys())
		isPage.value.set(key, false)
		console.log(lbPlayers.value)
	isPage.value.set(page, true)
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

		for (let i = 0; i < data.value.length; i++) {
			playersArray.push({
				...data.value[i],
				TotalMatches: await getLBTotalMatches(data.value[i].login),
			})
		}
	}
	if (data.value) lbPlayers.value = playersArray
}

const getLBTotalPages = async () => {
	const { data } = await useFetch<number>(`/leaderboard/totalPages`, {
		method: 'GET',
		baseURL: useRuntimeConfig().API_URL,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	return data.value
}

const getLBTotalMatches = async (player:string) => {
	const { data } = await useFetch<number>(`/achievement/playertotalgames/${player}?Win=false&Lose=false`, {
		method: 'GET',
		baseURL: useRuntimeConfig().API_URL,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	return data.value
}

const getLadderRank = (ladder) => {
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
