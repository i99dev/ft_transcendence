<template>
	<div>
        <div class="grid grid-cols-1 md:lg:xl:grid-cols-3 group bg-white shadow-xl shadow-neutral-100 border ">
            <div
                class="p-10 flex flex-col items-center text-center group md:lg:xl:border-r md:lg:xl:border-b hover:bg-slate-50 cursor-pointer">
                <span class="p-5 rounded-full bg-white text-white shadow-lg shadow-blue-800">
					<img src="../../assets/png-clipart-monkey-d-luffy-gomu-gomu-no-mi-one-piece-devil-fruit-paramecia-all-kinds-of-fruit-purple-violet-removebg-preview.png" alt="achievement" />
				</span>
                <p class="text-xl font-medium text-slate-700 mt-3">Type</p>
                <p class="mt-2 text-sm text-slate-500">Description</p>
            </div>
		</div>
	</div>
</template>

<script setup>
import { getPlayerAchievement } from '@/composables/usePlayer'

const acheivement = await getPlayerAchievement()

const handle_test = () => {
	console.log('test ---> ', acheivement)
}



</script>

<style>
</style>