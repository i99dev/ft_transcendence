<template>
    <div>
        <div
            class="flex flex-col mobile:flex-col items-center shadow bg-background space-y-4 sm:p-6 p-1 w-full rounded-2xl">
            <div class="flex sm:flex-row flex-col items-center">

                <!--  avatar  -->
                <Avatar :isMe="isMe" :isProfile="isProfile" :image="userData?.image ||
                    defaultImages[Math.floor(Math.random() * defaultImages.length)]" :status="userData?.status" />


                <div class="flex sm:flex-col justify-center sm:p-6">
                    <!-- update username -->
                    <div class="flex flex-col justify-start w-full relative">
                        <div class="centered w-full">
                            <div class="sm:text-3xl text-lg text-white capitalize pr-2 w-fit h-8 overflow-hidden flex items-center justify-start p-2 whitespace-nowrap"
                                v-if="editBoolaen">
                                {{ userData?.username }}
                            </div>
                            <input v-if="!editBoolaen" :disabled="editBoolaen"
                                class="border-2 border-secondary bg-background text-white rounded-md p-1 max-w-xs w-32 h-8 mx-2"
                                type="text" v-model="userData.username" />
                            <!-- edit icon  -->
                            <div class="mx-2">
                                <button
                                    class="flex justify-center hover:bg-primary rounded-full p-2 w-12 h-12 smooth-transition"
                                    @click="editUsername" v-if="editBoolaen && isMe && !isProfile">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        class="w-8 h-8 stroke-4 stroke-white fill-none">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <!-- save -->
                                <button class="flex justify-center" @click="updateUsername" v-if="!editBoolaen">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="white" class="min-w-full h-8 bg-primary rounded-md">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!---- rank dropdown -->
                        <div class="mt-4 w-full">
                            <button @click="handleDropDown"
                                class="sm:text-xl p-2 flex justify-start items-start w-fit rounded-xl text-lg text-white hover:bg-primary smooth-transition focus:outline-none"
                                title="Your Rank">
                                {{ getLadderRank(userData.ladder) }}
                            </button>
                            <div v-if="showstat"
                                class="absolute top-0 left-full py-2 w-40 bg-background_light border-2 rounded-lg shadow-lg z-10">
                                <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out">XP
                                    level: {{ userData.xp }}</span>
                                <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out">Winning
                                    Rate: {{ (WinRate * 100).toFixed(2) }}%
                                </span>
                                <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out">Total
                                    Wins: {{ totalWins }}
                                </span>
                                <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out">Total
                                    Loses: {{ totaLoses }}</span>
                            </div>
                        </div>
                        <!-- <Stats :ladder="userData?.ladder" :xp="userData.xp" :username="userData?.username"  /> -->

                    </div>
                </div>
            </div>

            <!--- control buttons --> 
            <Control :isProfile="props.isProfile" :isMe="isMe" :login="userData.login" :username="props.username" />
        
        </div>
    </div>
</template>

<script setup lang="ts">

import Avatar from './Avatar.vue';
import Control from './Control.vue';

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

const { user_info, setUserName } = useUserInfo()

const user = await getUserbyUserName(props.username)

const isMe = ref(false)

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

/**
 * edit username
 */
const editBoolaen = ref(true)

const editUsername = () => {
    editBoolaen.value = !editBoolaen.value
}

const updateUsername = async () => {
    editBoolaen.value = !editBoolaen.value
    setUserName(userData.value?.username)
    await useUpdateUserInfo()
    window.location.reload()
}


const defaultImages = [
    'https://i1.ae/img/icons/1.png',
    'https://i1.ae/img/icons/2.png',
    'https://i1.ae/img/icons/3.png',
    'https://i1.ae/img/icons/4.png',
    'https://i1.ae/img/icons/5.png',
    'https://i1.ae/img/icons/6.png',
    'https://i1.ae/img/icons/7.png',
    'https://i1.ae/img/icons/8.png',
    'https://i1.ae/img/icons/9.png',
    'https://i1.ae/img/icons/10.png',
    'https://i1.ae/img/icons/11.png',
    'https://i1.ae/img/icons/12.png',
    'https://i1.ae/img/icons/13.png',
    'https://i1.ae/img/icons/14.png',
    'https://i1.ae/img/icons/20.png',
]

// Handle player stat drop down
const showstat = ref(false)
function handleDropDown() {
    showstat.value = !showstat.value
}

const WinRate = (await getPlayerWinRate(userData.value?.username)) as number

const totaLoses = await getPlayerGameResult(userData.value.username, false)

const totalWins = await getPlayerGameResult(userData.value.username, true)

const getLadderRank = (ladder: number) => {
    switch (ladder) {
        case 1:
            return 'Kaizoku Ou'
        case 2:
            return 'Yonkou'
        case 3:
            return 'Shichibukai'
        case 4:
            return 'Super Rookie'
        case 5:
            return 'Kaizoku'
        case 6:
            return 'Capin Boy'
    }
}
</script>
