<template>
    <div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="data">
            <!-- <Header /> -->
            <ChatNavBar class="z-10" />
            <FriendsListNav class="z-10" />
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Socket } from 'socket.io-client'

const chatSocket = useNuxtApp().chatSocket as Ref<Socket>
const { data, error, pending, refresh, execute } = await useMe()
const { setUserInfo } = useUserInfo()

if (data.value) {
    setInterval(() => {
        const exp = useCookie('expires_at').value as string
        if (exp === undefined) return
        const expires_at = parseInt(exp) * 1000
        
        if (Date.now() + 60 * 1000 > expires_at)
            refreshAccessToken()
    }, 10 * 1000)
}

if (data.value) await setUserInfo(data.value)
else if (error?.status === 401) navigateTo('/login')

chatSocket.value.on('exception', payload => {
    console.log(`${payload}: ${payload.message}`)
})
</script>
