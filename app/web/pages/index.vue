<template>
    <div>
        <UserProfileSetup v-if="isFirstTimeLogin" @close="closeSetup()" />
        <Home :username="user" />
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['pages'],
})

const { user_info } = useUserInfo()
const { isFirstTimeLogin, setIsFirstTimeLogin } = useIsFirstTime()
const { play } = useSound()
const user = ref('')
onMounted(() => {
    if (user_info.value) user.value = user_info.value?.username
    // play('login')
})

if (user_info.value) user.value = user_info.value?.username

const closeSetup = () => {
    setIsFirstTimeLogin(false)
}
</script>
