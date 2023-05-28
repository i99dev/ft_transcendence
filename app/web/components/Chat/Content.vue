<template>
    <div class="bg-background_light text-white rounded-lg h-full">
        <div class="p-2 relative flex h-16">
            <button
                class="flex flex-row justify-between w-24 hover:bg-primary smooth-transition items-center rounded-full p-1 focus:outline-secondary"
                v-click-effect="() => setCurrentChat(null)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-2 stroke-white file-none w-6 h-6"
                    viewBox="0 0 24 24"
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
                    <UserProfileStatus
                        v-if="chatType === 'DM'"
                        :status="currentChat?.users[0].status"
                        class="absolute bottom-0 right-1 w-3 h-3"
                    />
                </div>
            </button>

            <button
                v-click-effect="
                    () => {
                        chatType === 'DM'
                            ? goToUserProfile()
                            : (isChatInfoOpened = !isChatInfoOpened)
                    }
                "
                class="w-full flex items-center hover:bg-primary smooth-transition rounded-lg pl-2 focus:outline-secondary"
            >
                <div v-if="chatType === 'DM'" class="text-xl py-1">
                    {{ currentChat?.users[0].username }}
                </div>
                <div v-else class="text-xl py-1">{{ currentChat?.name }}</div>
            </button>
        </div>
        <ChatInfo
            v-if="isChatInfoOpened && chatType === 'GROUP'"
            @closeNavBar="$emit('closeNavBar')"
        />
        <div
            v-else
            class="flex flex-col justify-between overflow-hidden w-full h-9/10"
        >
            <div
                id="chat-messages"
                class="bg-background overflow-y-scroll box-content flex flex-col h-full"
            >
                <div class="centered" v-if="enableLoadMoreButton">
                    <button
                        class="bg-primary p-2 rounded-2xl my-2"
                        v-click-effect="() => loadMoreMessages(messagesPage)"
                    >
                        Load more
                    </button>
                </div>
                <div
                    class="rounded-lg p-2 mx-2 my-2 group relative"
                    v-for="message in messages?.slice().reverse()"
                    :class="{
                        'bg-secondary':
                            message.sender_login === user_info.login && message.type !== 'SPECIAL',
                        'bg-background_light': !(
                            message.sender_login === user_info.login && message.type !== 'SPECIAL'
                        ),
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
                            class="h-3 w-3 origin-bottom-left rotate-45 transform"
                            :class="{
                                'bg-secondary': message.sender_login === user_info.login,
                                'bg-background_light': message.sender_login !== user_info.login,
                            }"
                        ></div>
                    </div>
                    <div
                        v-if="chatType === 'GROUP' && message.type !== 'SPECIAL'"
                        class="text-sm font-bold capitalize"
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
                        class="text-white hidden group-hover:block absolute -top-1 left-0 bg-inherit rounded-full focus:outline-secondary"
                        @click="() => deleteMessage(message.id)"
                    >
                        <TrashIcon class="h-4 w-4" aria-hidden="true" />
                    </button>
                    <div
                        v-if="message.type !== 'SPECIAL'"
                        class="text-white opacity-70 text-sm flex justify-end"
                    >
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
            <div
                class="w-full h-24 centered p-2"
                :class="{
                    'mb-12': enableLoadMoreButton,
                }"
            >
                <form @submit.prevent="sendMessage" class="w-full flex justify-center">
                    <input
                        id="message-input"
                        v-model="newMessage"
                        type="text"
                        placeholder="Message"
                        class="w-11/12 p-3 border-2 border-secondary rounded-xl focus:border-secondary bg-background"
                        style="outline: none"
                        :disabled="AmIAllowed"
                    />
                    <button
                        type="submit"
                        class="bg-secondary hover:bg-primary smooth-transition text-white py-2 px-2 -ml-11 mt-2 rounded-full h-full focus:outline-secondary"
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
                participantsColors.value?.set(
                    participants.value[i].user_login,
                    `${getLightColor()}`,
                )
    }

    //scroll to bottom
    scrollToLastMessage()

    setTimeout(() => {
        document.getElementById('message-input')?.focus()
    }, 200)

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
        if (chatMessages) chatMessages.scrollTop = chatMessages?.scrollHeight
    }, 100)
}

const getLightColor = () => {
    return 'hsl(' + Math.random() * 360 + ', 100%, 75%)'
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
    navigateTo(`/users/${currentChat.value?.users[0]?.username}`)
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
