<template>
	<div>
	    <div>Dash Achievement</div>
	</div>
	
</template>

<script setup>
import { getPlayerAchievement } from '@/composables/usePlayer'

const acheivement = await getPlayerAchievement()

const handle_test = () => {
	console.log('test ---> ', acheivement)
}



</script>

<style></style>
