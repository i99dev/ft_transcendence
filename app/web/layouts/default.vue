<template>
    <div>
        <!-- success -->
        <div v-if="me">
            <Toast />
            <Header />
            <ChatNavBar />
            <FriendsListNav />
            <GameInviteBox v-if="inviteModal.open" class="z-20" />
            <slot />
        </div>
        <!-- loading -->
        <div v-else>
            <Loading class="w-screen h-screen centered" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { connectSockets, handleSocketDisconnection, disconnectSockets, logSocketExceptions } =
    useSockets()
const { setUserInfo } = useUserInfo()
const me = ref(undefined)
const { inviteModal } = await useGameInvite()

onMounted(async()=>{
    const { data, error } = await useMe()
    me.value = data.value
    
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
    
})

handleSocketDisconnection()
logSocketExceptions()
</script>
