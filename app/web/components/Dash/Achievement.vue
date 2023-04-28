<template>
	<div>
	    <div>Dash Achievement</div>
		<button @click="handle_test">Toggle</button>
	</div>
	
</template>

<script setup>
import { getPlayerAchievement } from '@/composables/usePlayer'

const acheivement = await getPlayerAchievement()

console.log('test ---> ', acheivement)

const handle_test = () => {
	console.log('test ---> ', acheivement)
}



</script>

<style></style>
