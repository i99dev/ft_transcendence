<template>
    <div>
        <div class="flex min-h-screen justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2">
            <!-- <p>{{ $route.params.username }} {{ username }} </p> -->
            <div class="flex flex-row justify-center w-1/2 mobile:w-full">
                <UserProfileCardOne class="w-full" :username="userName" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserInfo } from '../../composables/useMe'
import { getUserbyUserName } from '../../composables/useUsers'


const route = useRoute()

const { user_info } = useUserInfo()

const userName = user_info.value.username

const user = await getUserbyUserName(userName)


console.log('usersss', user)

</script>