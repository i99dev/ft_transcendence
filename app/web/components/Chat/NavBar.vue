<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="open = false">
            <div class="fixed inset-0" />

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div
                        class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
                    >
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full"
                        >
                            <DialogPanel class="pointer-events-auto w-screen max-w-md">
                                <div
                                    class="flex justify-between min-h-screen flex-col overflow-y-scroll bg-white shadow-xl"
                                >
                                    <div class="pt-2">
                                        <div class="flex items-start justify-between">
                                            <div class="ml-3 flex items-center">
                                                <button
                                                    type="button"
                                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                                    @click="setChatModalOpen(false)"
                                                >
                                                    <span class="sr-only">Close panel</span>
                                                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="chatListView" class="border-y mt-2 border-gray-200 h-full">
                                        <div class=" overflow-y-auto" style="max-height: 92vh; height: 92vh;">
                                            <!-- chat list -->
                                            <nav
                                                class="flex flex-col"
                                                x-descriptions="Tab component"
                                            >

                                                <!-- chat item -->
                                                <button v-for="item in directChats"
                                                    @click="() => switchChatView(item)"
                                                    class="p-2 border-y border-slate-100 bg-slate-200 hover:bg-slate-100 relative"
                                                >
                                                    <img
                                                        :src="item.users[1].image"
                                                        alt="User Photo"
                                                        class="rounded-full w-10 h-10 object-cover"
                                                    />
                                                    <!-- online badge -->
                                                    <span
                                                    class="absolute bottom-2 left-9 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                                                    />
                                                    <div class="absolute top-2 left-16 block text-slate-700">{{ item.users[1].username }}</div>
                                                </button>
                                            
                                            </nav>
                                        </div>
                                    </div>

                                    <!-- Chat view -->
                                    <div v-else class="bg-slate-200 rounded-lg">
                                        <div
                                            class="p-2 bg-slate-200 relative flex"
                                        >
                                            <button @click="switchChatView()">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#555" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M5 12l14 0"></path>
                                                    <path d="M5 12l6 6"></path>
                                                    <path d="M5 12l6 -6"></path>
                                                </svg>
                                            </button>
                                            
                                            <img
                                                :src="curdirectChat.users[1].image"
                                                alt="User Photo"
                                                class="rounded-full w-10 h-10 object-cover mx-1"
                                            />
                                            <!-- online badge -->
                                            <span
                                            class="absolute bottom-2 left-16 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                                            />
                                            <div class="text-slate-700 ml-2 text-xl py-1">{{ curdirectChat.users[1].username }}</div>
                                        </div>
                                        <div class="flex flex-col justify-between" style="height: 90vh;">
                                            <div id="chat-messages" class="overflow-y-scroll flex flex-col bg-white" style="height: 80vh;">
                                                <div
                                                    class="bg-gray-200 rounded-lg p-2 mx-2 my-2 w-3/4 "
                                                    v-for="(message, index) in messages"
                                                    :key="index"
                                                    :class="{ 'bg-green-200': message.sender_id === user_info.id, 'self-end': message.sender_id === user_info.id}"
                                                >
                                                    <div class="">
                                                        {{ message.content }}
                                                    </div>
                                                    <div class="text-gray-600 text-sm flex justify-end">
                                                        <!-- {{ new Date(message.created_at).toLocaleDateString('en-GB') }} -->
                                                        {{ new Date(message.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <form @submit.prevent="sendMessage">
                                                    <input
                                                        v-model="newMessage"
                                                        type="text"
                                                        placeholder="Message"
                                                        class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-400 mb-2"
                                                        style="outline: none;"
                                                    />
                                                    <button
                                                        type="submit"
                                                        class=" bg-blue-500 text-white py-2 px-2 -ml-10 mt-4 rounded-full h-full"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M10 14l11 -11"></path>
                                                            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

const { chat_info, setChatModalOpen, send_message } = useChat()

const { data, error, pending, refresh, execute } = await useDirectChats()

const directChats = ref()
const chatListView = ref(true)
const curdirectChat = ref()
const messages = ref()
const { user_info, setUserName, setUserAvatar } = useUserInfo()
const defaultMessageColor = 'text-gray-600'
const nuxtApp = useNuxtApp()
const chatSocket = nuxtApp.chatSocket
onMounted(() => {
    chatSocket.value.on('add-message', (payload) => {
        messages.value.push(payload)
        const chatMessages = document.getElementById('chat-messages')
        //scroll to bottom
        setTimeout(() => {chatMessages.scrollTop = chatMessages.scrollHeight}, 100)
    })
})

if (data) {
    directChats.value = data.value
}

const switchChatView = async (chat) => {
    if (chat) {
        chatListView.value = false
        curdirectChat.value = chat
        const { data, error, pending, refresh, execute } = await useChatMessages(chat.chat_room_id)
        if (data) {
            messages.value = data.value.messages   
        }
    }
    else {
        chatListView.value = true
        curdirectChat.value = null
    }
}

const newMessage = ref('')

const sendMessage = () => {
    // chatSocket.value.emit('add-message')
    chatSocket.value.emit('add-message', {room_id: 'direct_room1', message: "first message from client"})
    newMessage.value = ''
}
const open = computed(() => chat_info.value.chatModalOpen)
</script>

<style>
.chat-messages {
    scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
    width: 0.5rem;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}
/* screen width is less than 768px (medium) */
.chat-messages {
    height: 70vh;
}
</style>
