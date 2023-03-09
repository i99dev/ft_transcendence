<template>
    <nav class="rounded-md bg-blue-900 ">
		<button @click="go('/')" class="NuxtLink" > 
			Home
		</button>
		<button @click="go('/play')" class="NuxtLink">
			Play
		</button>
		<button @click="go('/matchHistory')" class="NuxtLink" >
			Match History
		</button>
		<button @click="logout" class="NuxtLink">
			Logout
		</button>
		<img @click="toggleProfileWindow" class="w-90 h-20 rounded-full" src="https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_6-1024.png">
	</nav>
    <div id="pro" v-if="showProfile">
        <Profile @close="toggleProfileWindow" />
    </div>
  </template>
  

<script setup>
const showProfile = ref(false)


const logout = () => {
	const token = useCookie('token')
	token.value = ''
	const code = useCookie('code')
	code.value = ''
	navigateTo('/login')
}

const go = (path) => {
	hideProfileWindow()
	useRouter().push(path)
}

const toggleProfileWindow = () => {
    showProfile.value = !showProfile.value;
}
const hideProfileWindow = () => {
    showProfile.value = false;
}
</script>

<style>
nav {
    background-color: #01304b;
    /* border: #ffffff 1px solid; */
    color: #fff;
    display: flex;
    justify-content: space-around;
    padding: 18px;
}

.NuxtLink:hover {
  color: rgb(124, 194, 237);
}

</style>
<style scoped>
#pro{
    display: flex;
    justify-content: center;
    /* margin-top: 100px */
}
</style>
