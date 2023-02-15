<template>
    <nav >
        <NuxtLink to="/" @click="hideProfileWindow" class="NuxtLink" > Home</NuxtLink>
        <NuxtLink to="Play" @click="hideProfileWindow" class="NuxtLink">Play</NuxtLink>
        <NuxtLink to="Matchhistory" @click="hideProfileWindow" class="NuxtLink">Match History</NuxtLink>
        <button @click="toggleProfileWindow" class="NuxtLink">
            Profile
        </button>
    </nav>
    <div  id="pro" v-if="showProfile">
        <Profile />
    </div>
  </template>
  

<script setup>
const showProfile = ref(false)
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
