<script lang="ts" setup>
import { Socket } from 'socket.io-client';

const chatSocket = useNuxtApp().chatSocket as Ref<Socket>
const { data, error, pending, refresh, execute } = await useMe()
const { setUserInfo } = useUserInfo()

if (data) {
    await setUserInfo(data.value)
}

chatSocket.value.on('exception', (payload)=>{
    console.log(`${payload}: ${payload.message}`)
})
</script>

<template>
    <div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="data">
            <!-- <Header /> -->
            <ChatNavBar />
            <FriendsListNav />
            <slot />
        </div>
    </div>
</template>
