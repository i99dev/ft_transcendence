<template>
    <div class="bg-gray-50">
        <div class="flex w-full justify-center py-6">
            <SearchBar @userInput="handleUserSearch" class="w-1/2" />
            <button
                @click="() => navigateTo('/')"
                class="h-10 w-30 ml-3 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            >
                Home
            </button>
        </div>
        <div v-if="user == null">
            <div class="justify-center flex min-h-full">
                <img
                    class="py-40 rounded"
                    src="https://media.tenor.com/mpRJETAa-WwAAAAC/chopper-tony-chopper.gif"
                />
            </div>
            <h1
                class="justify-center flex text-3xl font-bold tracking-tight text-center text-blue-900 sm:text-3xl"
            >
                " {{ $route.params.username }} " user doesn't exist !
            </h1>
        </div>
        <div
            v-else
            class="flex min-h-screen justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2"
        >
            <div class="flex flex-col w-full space-y-6 items-center">
                <div class="flex flex-row justify-center w-1/2 mobile:w-full">
                    <UserProfileCardOne
                        class="w-full"
                        :username="userName"
                        :isProfile="IsProfile"
                    />
                </div>
                <div class="grid grid-flow-col-dense sm:flex gap-4 w-full justify-center"></div>
                <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between w-full">
                    <div
                        class="w-full sm:w-1/4 rounded-t sm:rounded-l sm:rounded-t-none shadow bg-white dark:bg-gray-800"
                    ></div>
                    <div class="w-full sm:w-1/2 dark:bg-gray-800">
                        <DashTab :username="userName" />
                    </div>
                    <div
                        class="w-full sm:w-1/4 rounded-b sm:rounded-b-none shadow bg-white dark:bg-gray-800"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const route = useRoute()

const IsProfile = ref(true)

const userName = computed(() => {
    let username: string
    if (
        Array.isArray(route.params.username) &&
        route.params.username.every(item => typeof item === 'string')
    )
        username = route.params.username[0]
    else username = route.params.username as string
    return username
})

const handleUserSearch = (username: string) => {
    navigateTo(`/users/${username}`)
}

const user = await getUserbyUserName(userName.value)
</script>
