<template>
    <div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="me">
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
const { data: me, error, pending, refresh, execute } = await useMe()
const { setUserInfo } = useUserInfo()

if (me.value) {
    setInterval(() => {
        const exp = useCookie('expires_at').value as string
        if (exp === undefined) return
        const expires_at = parseInt(exp) * 1000

        if (Date.now() + 60 * 1000 > expires_at) refreshAccessToken()
    }, 10 * 1000)
}

if (me.value) await setUserInfo(me.value)
else if (error?.status === 401) navigateTo('/login')

const { setBlockList } = useBlock()
const {data: myblockList} = await useBlockList()
if (myblockList.value) setBlockList(myblockList.value)

// log socket errors/exceptions
chatSocket.value.on('exception', payload => {
    console.log(`${payload}: ${payload.message}`)
})
</script>
