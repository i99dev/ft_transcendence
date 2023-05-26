<template>
    <div>
        <div
            v-if="props.username"
            id="Home"
            class="flex min-h-screen justify-center overflow-hidden py-5 mobile:p-2"
        >
            <div class="flex flex-col w-full space-y-6 items-center">
                <div class="centered lg:w-1/2 w-3/4">
                    <UserProfileCardOne
                        class="w-full"
                        :username="props.username"
                        :isProfile="IsProfile"
                    />
                </div>
                <button
                    v-click-effect:play="() => navigateTo('/play')"
                    class="h-10 w-30 hover:scale-125 smooth-transition text-white bg-primary hover:bg-access font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 inline-flex items-center"
                >
                    Play
                </button>

                <div class="flex flex-wrap sm:flex-no-wrap items-center justify-center iterms-center w-full">
                    <div class="w-full sm:w-3/4 lg:w-1/2">
                        <DashTab :username="props.username" />
                    </div>
                </div>
                <!-- Acheivement popup -->
                <AchievPoPUp />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const IsProfile = ref(false)

const props = defineProps(['username'])

const handleUserSearch = (username: string) => {
    navigateTo(`/users/${username}`)
}
</script>
