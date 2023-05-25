<template>
    <div v-if="props.isMe && !props.isProfile" class="flex flex-row space-x-6">
        <button
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square"
            v-click-effect="openChatModel"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-8 h-8 sroke-4 stroke-white fill-none"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
            </svg>
        </button>
        <button
        v-click-effect="openFriendsModel"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-8 h-8 sroke-4 stroke-white fill-none"
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
                    'bg-current': notifications?.length == 0,
                    'bg-tertiary': notifications?.length != 0,
                }"
            >
                <div class="text-xs font-semibold text-center text-white">
                    {{ notifications?.length }}
                </div>
            </div>
        </button>
        <button
        v-click-effect="useLogout"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 stroke-4 stroke-white fill-none"
                viewBox="0 0 24 24"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                    d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                ></path>
                <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
            </svg>
        </button>
        <button
        v-click-effect="updateTwoFacAuth"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square"
        >
            <svg
                v-if="user_info.two_fac_auth"
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 fill-white stroke-white stroke-4"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                    d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                    stroke-width="0"
                ></path>
            </svg>
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 fill-none stroke-white stroke-4"
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
        v-click-effect="()=> navigateTo('/help')"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="fill-white w-8 h-8" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                    d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
                />
            </svg>
        </button>
        <button v-if="muteSound" v-click-effect="handleMuteSound"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-volume-mute fill-white w-10 h-10" viewBox="0 0 16 16">
                <path
                    d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
            </svg>
        </button>
        <button v-else v-click-effect="handleMuteSound"
            class="relative hover:bg-primary rounded-full smooth-transition p-2 w-12 aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up fill-white w-10 h-10"
                viewBox="0 0 16 16">
                <path
                    d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                <path
                    d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                <path
                    d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z" />
            </svg>
        </button>
    </div>
    <div v-else-if="!props.isMe" class="flex space-x-6">
        <button v-click-effect="() => useDMUser(props.login)"
            class="p-2 hover:bg-primary transition ease-in-out duration-500 text-white rounded-full relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2">
            <ChatBubbleOvalLeftEllipsisIcon class="h-8 w-8" aria-hidden="true" />
        </button>
        <button v-click-effect="() => addFriend(props.username)" :title="'Add to friend list'"
            class="p-2 hover:bg-primary transition ease-in-out duration-500 text-white rounded-full relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2">
            <UserPlusIcon v-if="true" class="h-8 w-8" aria-hidden="true" />
            <UserMinusIcon v-else class="h-8 w-8" aria-hidden="true" />
        </button>
        <button v-click-effect="handleUserBlock"
            class="p-2 hover hover:bg-primary transition ease-in-out duration-500 text-white rounded-full relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2 capitalize"
            :class="{
                'bg-secondary': isBlocked(user),
            }"
        >
            {{ isBlocked(user) ? 'unblock' : 'block' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { stat } from 'fs';
import { useFriends } from '../../composables/Friends/useFriends'
import {
    UserPlusIcon,
    UserMinusIcon,
    ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    username: {
        type: String,
        default: '',
    },
    login: {
        type: String,
        default: '',
    },
    isMe: {
        type: Boolean,
        default: false,
    },
    isProfile: {
        type: Boolean,
        default: false,
    },
})

const { user_info, setUserTwoFacAuth } = useUserInfo()
const { chat_info, setChatModalOpen } = useChat()
const { friends_info, setFriendsModalOpen, addFriend, notifications } = await useFriends()
const { addUserToBlockList, removeUserFromBlockList, isBlocked } = await useBlock()
const user = await getUserbyUserName(props.username)
const { play, pause, isPaused } = useSound()
const muteSound = ref(!isPaused('login') as boolean)

useListen('soundTrack', (status: string)=> {
    if (status)
        muteSound.value = false
})

function openChatModel() {
    if (chat_info.value?.chatModalOpen) {
        setChatModalOpen(false)
    } else {
        setChatModalOpen(true)
    }
}

function handleMuteSound () {
    muteSound.value = !muteSound.value
    if (isPaused('login'))
        play('login')
    else if (!isPaused('login'))
        pause('login')
}

function goToHelp() {
    navigateTo('/help')
}

function handleUserBlock() {
    if (isBlocked(user)) {
        removeUserFromBlockList(user)
    } else {
        addUserToBlockList(user)
    }
}

function openFriendsModel() {
    if (friends_info.value?.friendsModalOpen) {
        setFriendsModalOpen(false)
    } else {
        setFriendsModalOpen(true)
    }
}

const updateTwoFacAuth = async () => {
    setUserTwoFacAuth(!user_info.value?.two_fac_auth)
    await useUpdateUserInfo()
}
</script>
