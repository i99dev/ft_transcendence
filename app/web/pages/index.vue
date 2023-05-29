<template>
    <div>
        <UserProfileSetup v-if="isFirstTimeLogin" :show="iSetup" :submit-button="'Set'" @closePopup="closeSetupProfile" />
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
const iSetup = ref(isFirstTimeLogin.value)
onMounted(() => {
    if (user_info.value) user.value = user_info.value?.username
    // play('login')
})

if (user_info.value) user.value = user_info.value?.username

const closeSetupProfile = () => {
    setIsFirstTimeLogin(false)
    iSetup.value = false
}
</script>
