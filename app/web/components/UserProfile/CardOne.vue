<template>
    <div>
        <div class="">
            <div
                class="flex flex-col mobile:flex-col items-center shadow bg-white dark:bg-gray-800 space-y-4 sm:p-6 p-1 w-full"
            >
                <div class="flex sm:flex-row flex-col items-center">
                    <div class="relative">
                        <img
                            class="rounded-full border-2 sm:h-32 h-20 sm:w-32 w-20 object-cover"
                            :src="
                                userData?.image ||
                                defaultImages[Math.floor(Math.random() * defaultImages.length)]
                            "
                            alt="logo"
                        />
                        <div
                            v-if="isMe && !isProfile"
                            @click="handleChangeImage"
                            class="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 hover:opacity-50"
                        >
                            <img
                                class="absolute inset-0 w-full h-full object-cover rounded-full"
                                src="https://icon-library.com/images/change-an-icon/change-an-icon-14.jpg"
                                alt="hover image"
                            />
                        </div>
                        <div v-if="updatePhoto" class="relative">
                            <div
                                class="absolute right-7 bg-white rounded-lg shadow-lg"
                                style="width: 15rem"
                            >
                                <div class="grid grid-cols-5 gap-4 p-4">
                                    <div v-for="(image, index) in defaultImages" :key="index">
                                        <img
                                            class="w-20 h-10 object-cover rounded-lg"
                                            :src="image"
                                            @click="updateAvatar(image)"
                                            alt="icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex sm:flex-col justify-center sm:p-6">
                        <p
                            v-if="isMe && !isProfile"
                            class="sm:text-3xl text-lg text-black dark:text-white"
                        >
                            Welcome
                        </p>
                        <!-- update username -->
                        <div class="flex flex-row items-center w-full justify-between">
                            <div
                                class="sm:text-2xl text-lg text-black dark:text-white px-2 w-32 h-8 overflow-hidden"
                                v-if="editBoolaen"
                            >
                                {{ userData?.username }}
                            </div>
                            <div v-if="!isMe || isProfile">
                                <img
                                    :src="getStatusIcon(userData.status)"
                                    class="h-4 w-4"
                                    :title="userData.status"
                                />
                            </div>
                            <input
                                v-if="!editBoolaen"
                                :disabled="editBoolaen"
                                class="border-2 border-gray-300 rounded-md p-1 max-w-xs w-32 h-8 mx-2"
                                type="text"
                                v-model="userData.username"
                            />
                            <!-- edit icon  -->
                            <div
                                class="flex justify-center"
                                @click="editUsername"
                                v-if="editBoolaen && isMe && !isProfile"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-8 h-8"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                </svg>
                            </div>

                            <!----
						rank dropdown
					-->
                            <div class="relative">
                                <div class="flex sm:flex-col justify-end sm:p-2">
                                    <div class="ml-14">
                                        <button
                                            @click="handleDropDown"
                                            class="sm:text-3xl text-lg text-black dark:text-white hover:text-blue-800 focus:outline-none"
                                            title="Your Rank"
                                        >
                                            {{ getLadderRank(userData.ladder) }}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    v-if="showstat"
                                    class="absolute left-14 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10"
                                >
                                    <span
                                        class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out"
                                        >XP level: {{ userData.xp }}</span
                                    >
                                    <span
                                        class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out"
                                        >Winning Rate: {{ (WinRate * 100).toFixed(2) }}%
                                    </span>
                                    <span
                                        class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out"
                                        >Total Wins: {{ totalWins }}
                                    </span>
                                    <span
                                        class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out"
                                        >Total Loses: {{ totaLoses }}</span
                                    >
                                </div>
                            </div>

                            <!-- save -->
                            <div
                                class="flex justify-center"
                                @click="updateUsername"
                                v-if="!editBoolaen"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="min-w-full h-8 bg-green-300"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isMe && !isProfile" class="flex flex-row space-x-6">
                    <div class="relative cursor-pointer" @click="openChatModel">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-8 h-8 mt-2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                        </svg>
                        <!-- badge online -->
                        <div
                            class="absolute -top-1 -right-1 bg-green-500 flex items-center justify-center rounded-full w-3.5 h-3.5 p-2.5"
                        >
                            <p class="text-xs font-semibold text-center text-white"></p>
                        </div>
                    </div>
                    <div @click="openFriendsModel" class="relative cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-8 h-8 mt-2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                            />
                        </svg>
                        <!-- badge offline -->
                        <div
                            class="absolute -top-1 -right-1 flex items-center justify-center rounded-full w-3.5 h-3.5 p-2.5"
                            :class="{
                                'bg-gray-500': notifications?.length == 0,
                                'bg-green-500': notifications?.length != 0,
                            }"
                        >
                            <div class="text-xs font-semibold text-center text-white">
                                {{ notifications?.length }}
                            </div>
                        </div>
                    </div>
                    <button @click="useLogout" class="cursor-pointer relative rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8 stroke-1 stroke-current"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                            ></path>
                            <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
                        </svg>
                    </button>
                    <button @click="updateTwoFacAuth" class="cursor-pointer relative rounded-full">
                        <svg
                            v-if="user_info.two_fac_auth"
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8 fill-white stroke-black stroke-1"
                            viewBox="0 0 24 24"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                                d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                                stroke-width="0"
                                fill="currentColor"
                            ></path>
                        </svg>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8 fill-white stroke-black stroke-1"
                            viewBox="0 0 24 24"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                                d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"
                            ></path>
                        </svg>
                    </button>
                    <button
                        @click="navigateTo('/help')"
                        class="cursor-pointer relative rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="50"
                            fill="currentColor"
                            class="bi bi-question-circle"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                            />
                            <path
                                d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
                            />
                        </svg>
                    </button>
                </div>
                <div v-else-if="!isMe" class="flex space-x-6">
                    <button
                        @click="addFriend(username)"
                        :title="'Add to friend list'"
                        class="p-2 border-y border-slate-100 bg-slate-100 rounded-full relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2"
                    >
                        <UserPlusIcon v-if="true" class="h-8 w-8" aria-hidden="true" />
                        <UserMinusIcon v-else class="h-8 w-8" aria-hidden="true" />
                    </button>
                    <button
                        @click="
                            isBlocked(user)
                                ? removeUserFromBlockList(user)
                                : addUserToBlockList(user)
                        "
                        :title="isBlocked(user) ? 'unblock user' : 'block user'"
                        class="p-2 border-y border-slate-100 bg-slate-100 rounded-full relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8 stroke-2 stroke-current"
                            :class="{ 'fill-none': !isBlocked(user) }"
                            viewBox="0 0 24 24"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5"></path>
                            <path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5"></path>
                            <path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5"></path>
                            <path
                                d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserPlusIcon, UserMinusIcon } from '@heroicons/vue/24/outline'
import { useFriends } from '../../composables/Friends/useFriends'
import { ref, computed } from 'vue'

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

const { user_info, setUserName, setUserAvatar, setUserTwoFacAuth } = useUserInfo()
const user = await getUserbyUserName(props.username)
const { addUserToBlockList, removeUserFromBlockList, isBlocked } = await useBlock()

const isMe = ref(false)

const userData = computed(() => {
    if (user_info.value?.username === props.username) {
        const { username, image, xp, ladder, status } = user_info.value
        // console.log(status)
        isMe.value = true
        return { username, image, xp, ladder, status }
    } else {
        const { username, image, xp, ladder, status } = user
        return { username, image, xp, ladder, status }
    }
})

/**
 * edit username
 */
const editBoolaen = ref(true)
const updatePhoto = ref(false)
const editUsername = () => {
    editBoolaen.value = !editBoolaen.value
}

const updateUsername = async () => {
    editBoolaen.value = !editBoolaen.value
    setUserName(userData.value?.username)
    await useUpdateUserInfo()
}

/**
 * edit avatar
 */
const updateAvatar = async (image: string) => {
    updatePhoto.value = !updatePhoto.value
    setUserAvatar(image)
    await useUpdateUserInfo()
}
const updateTwoFacAuth = async () => {
    setUserTwoFacAuth(!user_info.value?.two_fac_auth)
    await useUpdateUserInfo()
}

const handleChangeImage = () => {
    updatePhoto.value = !updatePhoto.value
}

const defaultImages = [
    'https://i1.ae/img/icons/1.png',
    'https://i1.ae/img/icons/2.png',
    'https://i1.ae/img/icons/3.png',
    'https://i1.ae/img/icons/4.png',
    'https://i1.ae/img/icons/5.png',
    'https://i1.ae/img/icons/6.png',
    'https://i1.ae/img/icons/7.png',
    'https://i1.ae/img/icons/15.png',
    'https://i1.ae/img/icons/8.png',
    'https://i1.ae/img/icons/9.png',
    'https://i1.ae/img/icons/10.png',
    'https://i1.ae/img/icons/11.png',
    'https://i1.ae/img/icons/12.png',
    'https://i1.ae/img/icons/13.png',
    'https://i1.ae/img/icons/14.png',
    'https://i1.ae/img/icons/16.png',
    'https://i1.ae/img/icons/17.png',
    'https://i1.ae/img/icons/18.png',
    'https://i1.ae/img/icons/19.png',
    'https://i1.ae/img/icons/20.png',
]

// messages
const { chat_info, setChatModalOpen, send_message } = useChat()
const { friends_info, setFriendsModalOpen, addFriend, notifications } = await useFriends()
function openChatModel() {
    if (chat_info.value?.chatModalOpen) {
        setChatModalOpen(false)
    } else {
        setChatModalOpen(true)
    }
}

function openFriendsModel() {
    if (friends_info.value?.friendsModalOpen) {
        setFriendsModalOpen(false)
    } else {
        setFriendsModalOpen(true)
    }
}

// Handle player stat drop down
const showstat = ref(false)
function handleDropDown() {
    showstat.value = !showstat.value
}

const WinRate = (await getPlayerWinRate(userData.value?.username)) as number

const totaLoses = await getPlayerGameResult(userData.value?.username, 'false', 'true')

const totalWins = await getPlayerGameResult(userData.value?.username, 'true', 'false')

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

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'ONLINE':
            return 'https://www.vippng.com/png/full/127-1270264_green-dot-icon-png-circle.png'
        case 'OFFLINE':
            return 'https://icon-library.com/images/grey-icon/grey-icon-10.jpg'
        case 'INQUEUE':
            return 'https://www.clker.com/cliparts/e/i/5/h/r/P/orange-circle-icon-hi.png'
        case 'INGAME':
            return 'https://www.seekpng.com/png/detail/206-2066026_purple-dot-png-violet-icon.png'
    }
}
</script>
