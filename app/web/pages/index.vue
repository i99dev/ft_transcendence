<template>
    <div>
        <FirstTimeLogin v-if="isFirsTimeUser" @close="closeSetup()" />
        <Home :username="user" />
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['pages'],
})

const { user_info } = useUserInfo()

const user = ref('')
onMounted(() => {
    if (user_info.value) user.value = user_info.value?.username
})

let isFirsTimeUser = ref(useRoute().query.status == '201' ? true : false)

const closeSetup = () => {
    isFirsTimeUser.value = false
}
</script>
