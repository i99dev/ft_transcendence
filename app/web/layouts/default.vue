<template>
    <div>
        <!-- success -->
        <div v-if="me">
            <Toast />
            <Header />
            <ChatNavBar />
            <FriendsListNav />
            <GameInviteBox v-if="inviteModal.open" class="z-20" />
            <DublicateWarningModal v-if="showDublicateModal" class="z-30" />
            <slot />
        </div>
        <!-- loading -->
        <div v-else>
            <Loading class="w-screen h-screen centered" size="w-32" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useDublicateModal } from '@/composables/Game/useSocket'
const { connectSockets, handleSocketDisconnection, disconnectSockets } =
    useSockets()
const { setUserInfo } = useUserInfo()
const { inviteModal } = await useGameInvite()
const { showDublicateModal } = useDublicateModal()
const me = ref(undefined)
const isMobile = useState<boolean>('isMobile', () => false)
const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

onMounted(async () => {
    // TODO: check if user is logged in
    const { data, error } = await useMe()
    me.value = data.value
    isMobile.value = mobileRegex.test(navigator.userAgent)

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
})
</script>
