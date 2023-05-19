<template>
    <div>
        <div id="Home"
            class="flex min-h-screen justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2">
            <FirstTimeLogin v-if="isFirsTimeUser" @close="closeSetup()" />
            <div class="flex flex-col w-full space-y-6 items-center">
                <SearchBar @userInput="handleUserSearch" class="w-1/2 inline-block z-10" />
                <div class="flex flex-row justify-center w-1/2 mobile:w-full">
                    <UserProfileCardOne class="w-full" :username="userName" :isProfile="IsProfile" />
                </div>
                <button @click="() => navigateTo('/play')"
                    class="h-10 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    Play
                </button>
                <div class="grid grid-flow-col-dense sm:flex gap-4 w-full justify-center"></div>

                <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between w-full">
                    <div class="w-full sm:w-1/4 rounded-t sm:rounded-l sm:rounded-t-none shadow bg-white dark:bg-gray-800">
                    </div>
                    <div class="w-full sm:w-1/2 dark:bg-gray-800">
                        <DashTab :username="userName" />
                    </div>
                    <div class="w-full sm:w-1/4 rounded-b sm:rounded-b-none shadow bg-white dark:bg-gray-800"></div>
                </div>
                <!-- Acheivement popup -->
                <AchievPoPUp />
                <GameInviteBox v-if="inviteModal.open" class="z-20" />

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { inviteModal } = useGameInvite()

definePageMeta({
    middleware: ['pages'],
})

let isFirsTimeUser = ref((useRoute().query.status == '201') ? true : false)

const closeSetup = () => {
    isFirsTimeUser.value = false
}

const IsProfile = ref(false)

const { user_info } = useUserInfo()

const userName = user_info.value.username

const handleUserSearch = (username: string) => {
    navigateTo(`/users/${username}`)
}
</script>
