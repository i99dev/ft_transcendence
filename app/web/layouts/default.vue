<template>
    <div>
        <Toast />
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="me">
            <Header />
            <ChatNavBar />
            <FriendsListNav />
            <slot />
        </div>
        <GameInviteBox v-if="inviteModal.open" class="z-20" />
    </div>
</template>

<script lang="ts" setup>
const { connectSockets, handleSocketDisconnection, disconnectSockets, logSocketExceptions } =
    useSockets()
const { data: me, error, pending, refresh, execute } = await useMe()
const { setUserInfo } = useUserInfo()

const { inviteModal } = await useGameInvite()
if (me.value) {
    setInterval(() => {
        const exp = useCookie('expires_at').value as string
        if (exp === undefined) return
        const expires_at = parseInt(exp) * 1000

        if (Date.now() + 60 * 1000 > expires_at) refreshAccessToken()
    }, 10 * 1000)
}

if (me.value) await setUserInfo(me.value)
else if (error?.status === 401) {
    disconnectSockets()
    navigateTo('/login')
}
connectSockets()

const { setBlockList } = useBlock()
const { data: myblockList } = await useBlockList()
if (myblockList.value) setBlockList(myblockList.value)

handleSocketDisconnection()
logSocketExceptions()
</script>
