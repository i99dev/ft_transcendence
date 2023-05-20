<template>
    <div>
        <Toast />
        <div class="fixed top-0 w-full h-20 z-10">
            <button
                @click="navigateTo('/')"
                class="absolute bottom-0 left-20 w-32"
            >
                <LoginLogo
                    :horizontal="true"
                    class="text-2xl"
                />
            </button>
        </div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="me">
            <!-- <Header /> -->
            <ChatNavBar class="z-10" />
            <FriendsListNav />
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { connectSockets, handleSocketDisconnection, disconnectSockets, logSocketExceptions } =
    useSockets()
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
