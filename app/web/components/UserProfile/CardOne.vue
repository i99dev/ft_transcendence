<template>
    <div>
        <div class="flex flex-col mobile:flex-col items-center shadow bg-background space-y-4 sm:p-6 p-1 w-full rounded-2xl">
            <div class="flex sm:flex-row flex-col items-center">

                <!--  avatar  -->
                <UserProfileAvatar :isMe="isMe" :isProfile="isProfile" :Image="userData.image" :status="userData?.status" />


                <div class="flex sm:flex-col justify-center sm:p-6">

                    <!-- update username -->
                    <div class="flex flex-col justify-start w-full relative">
                        
                        <div class="centered w-full">
                            <div v-if="isMe" class="sm:text-3xl text-lg text-white capitalize pr-2 w-fit h-8 overflow-hidden flex items-center justify-start p-2 whitespace-nowrap">
                                {{ userInfo?.username }}
                            </div>
                            <div v-else class="sm:text-3xl text-lg text-white capitalize pr-2 w-fit h-8 overflow-hidden flex items-center justify-start p-2 whitespace-nowrap">
                                {{ userData?.username }}
                            </div>
                            
                            <!-- edit icon  -->
                            <div class="mx-2">
                                
                                <button
                                    class="flex justify-center hover:bg-primary rounded-full p-2 w-12 h-12 smooth-transition"
                                    @click="editProfile" v-if="isMe && !isProfile">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        class="w-8 h-8 stroke-4 stroke-white fill-none">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>

                                <UserProfileSetup v-if="isEdit" v-on:close="closeSetupProfile" />

                            </div>
                        </div>

                        <!---- rank dropdown -->
                        <UserProfileStats :ladder="userData.ladder" :xp="userData.xp" :username="props.username" />

                    </div>
                </div>
            </div>

            <!--- control buttons -->
            <UserProfileControl :isProfile="props.isProfile" :isMe="isMe" :login="userData.login" :username="props.username" />

        </div>
    </div>
</template>

<script setup lang="ts">

const userInfo = ref() as any

const props = defineProps({
    username: {
        type: String,
        default: false,
    },
    isProfile: {
        type: Boolean,
        default: false,
    },
})


const user = await getUserbyUserName(props.username)

const isMe = ref(false)

const { user_info } = useUserInfo()

const userData = computed(() => {
    if (user_info.value?.username === props.username) {
        const { login, username, image, xp, ladder, status } = user_info.value
        isMe.value = true
        return { login, username, image, xp, ladder, status }
    } else {
        const { login, username, image, xp, ladder, status } = user
        return { login, username, image, xp, ladder, status }
    }
})

onMounted(() => {
    const { user_info } = useUserInfo()
    userInfo.value = user_info.value
})

/**
 * set up profile
 */
const isEdit = ref(false)

const closeSetupProfile = () => {
    isEdit.value = false
}

const editProfile = () => {
    isEdit.value = !isEdit.value
}


</script>
