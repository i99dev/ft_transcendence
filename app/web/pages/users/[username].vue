<template>
    <div>
        <div v-if="user == null">
			<p> {{ $route.params.username }} user doesn't exist </p>
		</div>
            <div
                v-else class="flex min-h-screen justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2"
            >
                <div class="flex flex-col w-full space-y-6 items-center">
                    <div class="flex flex-row justify-center w-1/2 mobile:w-full">
                        <UserProfileCardOne class="w-full" :username="userName" />
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
import { useRoute } from 'vue-router'
import { getUserbyUserName } from '../../composables/useUsers'
import { computed } from 'vue'

const route = useRoute()

const userName = computed(() => {
    let username = ''
    if (
        Array.isArray(route.params.username) &&
        route.params.username.every(item => typeof item === 'string')
    )
        username = route.params.username[0]
    else username = route.params.username
    return username
})

const user = await getUserbyUserName(userName.value)
console.log('usersss', user)
</script>