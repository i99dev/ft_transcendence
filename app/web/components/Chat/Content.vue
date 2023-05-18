<template>
    <div class="bg-slate-100 rounded-lg mt-2">
        <div class="p-2 relative flex">
            <button
                class="flex flex-row justify-between w-24 hover:bg-slate-200 items-center rounded-full p-1 focus:outline-indigo-400"
                @click="setCurrentChat(null)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-arrow-left"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="#555"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l14 0"></path>
                    <path d="M5 12l6 6"></path>
                    <path d="M5 12l6 -6"></path>
                </svg>
                <div class="relative">
                    <img
                        v-if="chatType === 'DM'"
                        :src="currentChat?.users[0].image"
                        alt="User Photo"
                        class="rounded-full w-10 h-10 object-cover mx-1"
                    />
                    <img
                        v-else
                        :src="currentChat?.image"
                        alt="User Photo"
                        class="rounded-full w-10 h-10 object-cover mx-1"
                    />
                    <span
                        class="absolute bottom-1 right-0 block h-3 w-3 rounded-full bg-indigo-500 border-2 border-white"
                    />
                </div>
            </button>

            <button
                @click="
                    chatType === 'DM' ? goToUserProfile() : (isChatInfoOpened = !isChatInfoOpened)
                "
                class="w-full flex hover:bg-slate-200 rounded-lg pl-2 focus:outline-indigo-400"
            >
                <div v-if="chatType === 'DM'" class="text-slate-700 text-xl py-1">
                    {{ currentChat?.users[0].username }}
                </div>
                <div v-else class="text-slate-700 text-xl py-1">{{ currentChat?.name }}</div>
            </button>
        </div>
        <ChatInfo v-if="isChatInfoOpened && chatType === 'GROUP'" />
        <div
            v-else
            class="flex flex-col justify-between overflow-hidden w-full h-full"
            style="height: 90vh"
        >
            <div
                id="chat-messages"
                class="bg-white overflow-y-scroll box-content flex flex-col h-full"
            >
                <div class="centered" v-if="enableLoadMoreButton">
                    <button
                        class="bg-slate-200 p-2 rounded-2xl my-2"
                        @click="loadMoreMessages(messagesPage)"
                    >
                        Load more
                    </button>
                </div>
                <div
                    class="bg-gray-200 rounded-lg p-2 mx-2 my-2 group relative"
                    v-for="message in messages?.slice().reverse()"
                    :class="{
                        'bg-indigo-200':
                            message.sender_login === user_info.login && message.type !== 'SPECIAL',
                        'self-end': message.sender_login === user_info.login,
                        'self-center': message.type === 'SPECIAL',
                        'w-9/12': message.type !== 'SPECIAL',
                    }"
                >
                    <div
                        v-if="message.type !== 'SPECIAL'"
                        class="ml-2 -mb-[1px] inline-block overflow-hidden top-0 absolute transform -scale-y-100"
                        :class="{
                            '-left-3': message.sender_login !== user_info.login,
                            '-right-1': message.sender_login === user_info.login,
                            '-scale-x-100': message.sender_login === user_info.login,
                        }"
                    >
                        <div
                            class="h-3 w-3 origin-bottom-left rotate-45 transform bg-gray-200"
                            :class="{ 'bg-indigo-200': message.sender_login === user_info.login }"
                        ></div>
                    </div>
                    <div
                        v-if="chatType === 'GROUP' && message.type !== 'SPECIAL'"
                        class="text-sm"
                        :style="{ color: participantsColors.get(message.sender_login) }"
                    >
                        {{ message.sender.username }}
                    </div>
                    <div
                        v-if="
                            chatType === 'DM' ||
                            (chatType === 'GROUP' && !isBlocked(message.sender))
                        "
                        class="break-words"
                        :class="{
                            'text-sm': message.type === 'SPECIAL',
                        }"
                    >
                        {{ message.content }}
                    </div>
                    <div v-else class="text-sm opacity-50 centered capitalize">blocked content</div>
                    <button
                        v-if="
                            message.sender_login === user_info.login && message.type !== 'SPECIAL'
                        "
                        class="text-slate-700 hidden group-hover:block absolute -top-2 left-0 bg-inherit rounded-full focus:outline-indigo-400"
                        @click="deleteMessage(message.id)"
                    >
                        <TrashIcon class="h-4 w-4" aria-hidden="true" />
                    </button>
                    <div
                        v-if="message.type !== 'SPECIAL'"
                        class="text-gray-600 text-sm flex justify-end"
                    >
                        <!-- {{ new Date(message.created_at).toLocaleDateString('en-GB') }} -->
                        {{
                            new Date(message.created_at).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })
                        }}
                    </div>
                </div>
            </div>
            <div class="w-full h-min mb-8">
                <form @submit.prevent="sendMessage" class="w-full flex justify-center my-4">
                    <input
                        id="message-input"
                        v-model="newMessage"
                        type="text"
                        placeholder="Message"
                        class="w-11/12 p-3 border-2 border-gray-300 rounded-xl focus:border-indigo-400"
                        style="outline: none"
                        :disabled="AmIAllowed"
                    />
                    <button
                        type="submit"
                        class="bg-indigo-400 hover:bg-indigo-500 text-white py-2 px-2 -ml-11 mt-2 rounded-full h-full focus:outline-indigo-400"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-send"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10 14l11 -11"></path>
                            <path
                                d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
                            ></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline'
import { Socket } from 'socket.io-client'

const { user_info } = useUserInfo()
const { isBlocked } = useBlock()

const { chatSocket } = useChatSocket()
const messages = ref()
const messagesPage = ref(1)
const enableLoadMoreButton = ref(true)
const newMessage = ref('')
const isChatInfoOpened = ref(false)
const { participants, setParticipants, updateParticipants } = useGroupChatParticipants()
const me = ref()
const participantsColors = ref(new Map<string, string>())
const AmIAllowed = computed(() => {
    return (
        (chatType.value === 'GROUP' && me.value?.status === 'MUTE') ||
        (chatType.value === 'DM' && isBlocked(currentChat.value?.users[0]))
    )
})
const { chatType } = useChatType()
const emit = defineEmits(['closeNavBar'])
const { currentChat, setCurrentChat } = useCurrentChat()

onMounted(async () => {
    if (chatType.value === 'GROUP') {
        updateParticipants()
        me.value = participants.value?.find(
            (participant: any) => participant.user_login === user_info.value?.login,
        )

        // set random color for each participant
        if (participants.value)
            for (let i = 0; i < participants.value?.length; i++)
                participantsColors.value?.set(participants.value[i].user_login, `${getDarkColor()}`)
    }

    //scroll to bottom
    scrollToLastMessage()

    document.getElementById('message-input')?.focus()

    socketOn()

    loadMoreMessages()
})

const socketOn = () => {
    chatSocket.value?.on('add-message', (payload: chatMessage) => {
        messages.value?.unshift(payload)

        //scroll to bottom
        scrollToLastMessage()
    })

    chatSocket.value?.on('delete-message', (payload: number) => {
        messages.value = messages.value?.filter((message: chatMessage) => message.id !== payload)
    })

    chatSocket.value?.on('group-chat-users', (payload: ChatUser[]) => {
        setParticipants(payload)
        if (participants.value)
            me.value = participants.value?.find(
                (participant: any) => participant.user_login === user_info.value?.login,
            )
    })
}

const scrollToLastMessage = () => {
    if (isChatInfoOpened.value) return
    const chatMessages = document.getElementById('chat-messages') as HTMLElement
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight
    }, 100)
}

const getDarkColor = () => {
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10)
    }
    return color
}

const sendMessage = () => {
    chatSocket.value?.emit(
        'add-message',
        JSON.stringify({ room_id: currentChat.value?.chat_room_id, message: newMessage.value }),
    )
    newMessage.value = ''
}

const loadMoreMessages = async (page: number = 1) => {
    if (currentChat.value) {
        const { data } = await useChatMessages(currentChat.value?.chat_room_id, page)
        if (data.value) {
            if (data.value?.length < 20) enableLoadMoreButton.value = false
            if (!messages.value) messages.value = data.value
            else messages.value = messages.value?.concat(data.value)
        }
    }
    messagesPage.value++
}

const deleteMessage = (message_id: number) => {
    chatSocket.value?.emit(
        'delete-message',
        JSON.stringify({ room_id: currentChat.value?.chat_room_id, message_id: message_id }),
    )
}

const goToUserProfile = () => {
    navigateTo(`users/${currentChat.value?.users[0]?.login}`)
    emit('closeNavBar')
}
</script>

<style scoped>
#chat-messages {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#chat-messages::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
</style>
