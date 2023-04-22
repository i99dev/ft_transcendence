<script setup>
import { getPlayerWinRate,  getPlayerTotalLoses, getPlayerTotalWins} from '@/composables/usePlayer'

const { user_info, setUserName, setUserAvatar } = useUserInfo()

const userData = computed(() => {
    return user_info.value
})
/**
 * edit username
 */
const editBoolaen = ref(true)
const updatePhoto = ref(false)
const editUsername = () => {
    editBoolaen.value = !editBoolaen.value
}
const updatePhotoBoolaen = () => {
    updatePhoto.value = !updatePhoto.value
}
const updateUsername = async () => {
    editBoolaen.value = !editBoolaen.value
    setUserName(userData.value.username)
    await useUpdateUserInfo()
}
/**
 * edit avatar
 */
const updateAvatar = async () => {
    updatePhoto.value = !updatePhoto.value
    setUserAvatar(userData.value.image)
    await useUpdateUserInfo()
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
const { friends_info, setFriendsModalOpen, add_friend } = useFriends()

function openChatModel() {
    if (chat_info.value.chatModalOpen) {
        setChatModalOpen(false)
    } else {
        setChatModalOpen(true)
    }
}

function openFriendsModel() {
    if (friends_info.value.friendsModalOpen) {
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

const WinRate = await getPlayerWinRate()

const totaLoses = await getPlayerTotalLoses()

const totalWins = await getPlayerTotalWins()


</script>

<template>
    <div>
        <div class="">
            <div
                class="flex flex-col mobile:flex-col items-center shadow bg-white dark:bg-gray-800 space-y-4 sm:p-6 p-1 w-full"
            >
                <div class="flex sm:flex-row flex-col items-center">
                    <img
                        v-if="userData"
                        class="rounded-full border-2 sm:h-32 h-20 sm:w-32 w-20 object-cover"
                        :src="
                            userData?.image ||
                            defaultImages[Math.floor(Math.random() * defaultImages.length)]
                        "
                        alt="logo"
                    />

                    <div class="flex sm:flex-col justify-center sm:p-6">
                        <p class="sm:text-3xl text-lg text-black dark:text-white">Welcome</p>
                        <!-- update username -->
                        <div class="flex flex-row items-center w-full justify-between">
                            <div
                                class="sm:text-2xl text-lg text-black dark:text-white px-2 w-32 h-8 overflow-hidden"
                                v-if="editBoolaen"
                            >
                                {{ userData?.username }}
                            </div>
                            <input
                                v-if="!editBoolaen"
                                :disabled="editBoolaen"
                                class="border-2 border-gray-300 rounded-md p-1 max-w-xs w-32 h-8 mx-2"
                                type="text"
                                :value="userData?.username"
                                @input="userData.username = $event.target.value"
                            />
                            <!-- edit icon  -->
                            <div
							class="flex justify-center"
							@click="editUsername"
							v-if="editBoolaen"
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
							<button @click="handleDropDown" class="sm:text-3xl text-lg text-black dark:text-white hover:text-blue-800 focus:outline-none">
								{{ userData.ladder }}
							</button>
						  </div>
						</div>
						<div v-if="showstat" class="absolute left-14 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10">
							<span class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out">XP level: {{ userData.xp }}</span>
							<span class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out">Winning Rate: {{ WinRate * 100 }}% </span>
							<span class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out">Total Wins: {{ totalWins }} </span>
							<span class="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out">Total Loses: {{ totaLoses }}</span>
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

                <div class="flex flex-row space-x-6">
                    <div class="relative" @click="openChatModel">
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                        </svg>
                        <!-- badge online -->
                        <div
                            class="absolute -top-1 -right-1 bg-green-500 flex items-center justify-center rounded-full w-3.5 h-3.5 p-2.5"
                        >
                            <p class="text-xs font-semibold text-center text-white">2</p>
                        </div>
                    </div>
                    <div @click="openFriendsModel" class="relative cursor-pointer">
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
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                            />
                        </svg>
                        <!-- badge offline -->
                        <div
                            class="absolute -top-1 -right-1 bg-gray-500 flex items-center justify-center rounded-full w-3.5 h-3.5 p-2.5"
                        >
                            <div class="text-xs font-semibold text-center text-white">10</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
