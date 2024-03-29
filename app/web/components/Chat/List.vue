<template>
    <div class="border-y border-white h-90vh overflow-hidden">
        <div id="chat-list" class="overflow-y-scroll h-full">
            <!-- chat list -->
            <div class="flex flex-col" x-descriptions="Tab component">
                <TransitionRoot appear :show="isJoinGroupChatOpened" as="template">
                    <Dialog as="div" @close="closejoinGroupPasswordPopup()" class="relative z-10">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="fixed inset-0 bg-black bg-opacity-25" />
                        </TransitionChild>

                        <div class="fixed inset-0">
                            <div
                                class="absolute w-80 top-1/4 right-10 min-h-full items-center justify-end p-4 text-center"
                            >
                                <TransitionChild
                                    as="template"
                                    enter="duration-300 ease-out"
                                    enter-from="opacity-0 scale-95"
                                    enter-to="opacity-100 scale-100"
                                    leave="duration-200 ease-in"
                                    leave-from="opacity-100 scale-100"
                                    leave-to="opacity-0 scale-95"
                                >
                                    <DialogPanel
                                        class="w-full max-w-md transform overflow-hidden rounded-2xl bg-background_light p-6 text-left align-middle shadow-xl transition-all"
                                    >
                                        <form @submit.prevent="" class="flex">
                                            <div class="relative mx-2">
                                                <div
                                                    @click="changePasswordView"
                                                    class="absolute right-2 text-gray-600 hover:text-gray-700 flex items-center h-full cursor-pointer"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="stroke-secondary fill-none stroke-2 w-5 h-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" />
                                                        <circle cx="12" cy="12" r="2" />
                                                        <path
                                                            d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2"
                                                        />
                                                        <path
                                                            d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2"
                                                        />
                                                    </svg>
                                                </div>
                                                <input
                                                    class="text-white focus:outline-none focus:border focus:border-secondary bg-background_light font-normal w-full h-10 flex items-center pl-3 text-sm border-white rounded border shadow"
                                                    id="joinGroupPassword"
                                                    type="password"
                                                    v-model="joinGroupPassword"
                                                    placeholder="Enter password"
                                                />
                                            </div>
                                            <button
                                                class="h-auto w-auto border rounded-lg bg-secondary hover:bg-secondary ease-in-out transition duration-200 p-1"
                                                @click.stop="joinGroupChat()"
                                            >
                                                <span class="text-sm p-1 text-white capitalize">
                                                    join
                                                </span>
                                            </button>
                                        </form>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </TransitionRoot>

                <!-- chat element -->
                <button
                    v-for="chat in chats"
                    :key="chat?.id"
                    @click="selectChat(chat)"
                    class="p-2 border-t border-white bg-background_light hover:bg-secondary group smooth-transition flex relative w-full focus:outline-secondary"
                    :class="{ 'cursor-default': !chatType }"
                    @mouseover="hoverButton = chat"
                    @mouseleave="hoverButton = null"
                >
                    <div class="relative" style="width: 10%">
                        <img
                            v-if="chatType === 'DM'"
                            :src="chat?.users[0].image"
                            alt="User Photo"
                            class="rounded-full w-10 h-10 object-cover"
                        />
                        <img
                            v-else
                            :src="chat?.image"
                            alt="User Photo"
                            class="rounded-full w-10 h-10 object-cover"
                        />
                        <!-- online badge -->
                        <UserProfileStatus
                            v-if="chatType === 'DM'"
                            :status="chat?.users[0].status"
                            class="absolute bottom-0 right-1 w-3 h-3"
                        />
                    </div>

                    <!-- last message details -->
                    <div class="flex justify-between" style="width: 90%">
                        <div class="flex flex-col mx-4 w-1/2">
                            <div v-if="chatType === 'DM'" class="flex justify-start text-white">
                                {{ chat?.users[0].username }}
                            </div>
                            <!-- there should be one user only -->
                            <div
                                v-else
                                class="flex justify-start text-white"
                                :class="{ 'h-10': !chatType, 'items-center': !chatType }"
                            >
                                {{ chat?.name }}
                            </div>

                            <div
                                v-if="chatType"
                                class="w-full flex justify-start whitespace-nowrap text-xs text-white opacity-70 group-hover:opacity-100"
                            >
                                <span v-if="chatType === 'GROUP'" class="w-auto mr-2">
                                    {{ chat?.chat_room.messages[0]?.sender_login
                                    }}<span v-if="chat?.chat_room.messages[0]">:</span>
                                </span>
                                <span
                                    class="inline-block max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ chat?.chat_room.messages[0]?.content }}
                                </span>
                            </div>
                        </div>
                        <!-- Invite Game Button -->
                        <button
                            v-if="(chatType === 'DM' || chatType === null) && hoverButton === chat"
                            class="absolute right-1/4 top-1/4 h-auto w-auto border rounded-full bg-primary opacity-70 hover:opacity-100 hover:text-teri ease-in-out transition duration-200 p-1"
                            @click.stop="HandleItemButton(chat)"
                        >
                            <svg
                                v-if="chatType === 'DM'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5 stroke-white stroke-2 fill-none"
                                viewBox="0 0 24 24"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                    d="M12.718 20.713a7.64 7.64 0 0 1 -7.48 -12.755l.72 -.72a7.643 7.643 0 0 1 9.105 -1.283l2.387 -2.345a2.08 2.08 0 0 1 3.057 2.815l-.116 .126l-2.346 2.387a7.644 7.644 0 0 1 -1.052 8.864"
                                ></path>
                                <path d="M14 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                                <path d="M9.3 5.3l9.4 9.4"></path>
                            </svg>
                            <span v-else class="text-sm p-1 text-white capitalize"> join </span>
                        </button>
                        <div class="w-20 flex justify-center">
                            <div
                                class="text-xs text-white opacity-70 group-hover:opacity-100 w-12 flex justify-center items-center"
                            >
                                <span v-if="chatType && chat.chat_room.messages[0]">
                                    {{
                                        getDisplayDate(
                                            new Date(
                                                chat.chat_room.messages[0]?.created_at,
                                            ).getFullYear(),
                                            new Date(
                                                chat.chat_room.messages[0]?.created_at,
                                            ).getMonth() + 1,
                                            new Date(
                                                chat.chat_room.messages[0]?.created_at,
                                            ).getDate(),
                                        )
                                    }}
                                </span>
                                <span v-else class="lowercase font-bold">
                                    {{ chat.type }}
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <!-- create group chat -->
            <div v-if="chatType === 'GROUP'">
                <div class="absolute bottom-10 right-10">
                    <button
                        type="button"
                        @click="
                            () => {
                                isChatCreateGroupOpened = true
                            }
                        "
                        class="rounded-full bg-secondary hover:bg-primary smooth-transition opacity-60 p-4 font-medium text-white hover:opacity-90 transition duration-200 ease-in-out focus:outline-secondary"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-plus"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 5l0 14"></path>
                            <path d="M5 12l14 0"></path>
                        </svg>
                    </button>
                </div>
                <ChatCreateGroup
                    :isOpened="isChatCreateGroupOpened"
                    @closeGroupChatCreation="isChatCreateGroupOpened = false"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'

const { chatSocket } = useChatSocket()
watch(chatSocket, async () => {
    socketOn()
})
const { chats, setChats } = useChats()
const { chatType, setChatType } = useChatType()
const { setGroupChatSearching } = useGroupChatSearching()
const { chatView, setChatView } = useChatView()
const { setCurrentChat } = useCurrentChat()
const isChatCreateGroupOpened = ref(false)
const isJoinGroupChatOpened = ref(false)
const joinGroupPassword = ref('')
const selectedChat = ref()
const hoverButton = ref(null)
const emit = defineEmits(['closeNavBar', 'selectChat', 'showInvite'])

onMounted(() => {
    socketOn()
})

const socketOn = () => {
    chatSocket.value?.on('new-group-list', payload => {
        if (chatType.value) setChats(payload.content)
        setChatType('GROUP')
        setGroupChatSearching(false)
    })
}

const HandleItemButton = (chat: DirectChat & GroupChat) => {
    if (chatType.value === 'DM') {
        emit('showInvite', chat.users[0].login)
    } else {
        selectedChat.value = chat
        if (chat.type === 'PROTECTED') isJoinGroupChatOpened.value = true
        else joinGroupChat()
    }
}

const selectChat = (chat: GroupChat & DirectChat) => {
    if (chatType.value) {
        setChatView(false)
        setCurrentChat(chat)
    }
}

const joinGroupChat = () => {
    chatSocket.value?.emit(
        'join-group-chat',
        JSON.stringify({
            room_id: selectedChat.value?.chat_room_id,
            password: joinGroupPassword.value,
        }),
    )
    closejoinGroupPasswordPopup()
}

const changePasswordView = () => {
    let input = document.getElementById('joinGroupPassword') as HTMLInputElement
    input.type = input.type === 'text' ? 'password' : 'text'
}
const closejoinGroupPasswordPopup = () => {
    isJoinGroupChatOpened.value = false
    selectedChat.value = null
    setTimeout(() => {
        joinGroupPassword.value = ''
    }, 200)
}
</script>

<style scoped>
#chat-list {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#chat-list::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
</style>
