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
                                    class="flex min-h-screen flex-col overflow-y-scroll bg-white shadow-xl"
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
                                        <div class="px-6 overflow-y-auto" style="max-height: 92vh; height: 92vh;">
                                            <!-- chat list -->
                                            <nav
                                                class="flex flex-col"
                                                x-descriptions="Tab component"
                                            >

                                                <!-- chat item -->
                                                <button v-for="item in directChats"
                                                    @click="() => chatListView = false"
                                                    class="p-2 rounded-3xl mt-2 bg-slate-200 hover:bg-slate-100 relative"
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
                                                    <div class="absolute top-2 left-16 block text-slate-700">{{ item.users[1].login }}</div>
                                                </button>
                                            
                                            </nav>
                                        </div>
                                    </div>
                                    <div v-else class="bg-white rounded-lg p-4 flex-auto">
                                        
                                        <div class="chat-messages overflow-y-auto mb-2">
                                            <div
                                                class="bg-gray-200 rounded-lg p-2 my-2"
                                                v-for="(message, index) in messages"
                                                :key="index"
                                            >
                                                <div class="text-gray-700 font-semibold">
                                                    {{ message.user }}
                                                </div>
                                                <div class="text-gray-600 text-sm">
                                                    {{ message.time }}
                                                </div>
                                                <div>
                                                    {{ message.message }}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <form @submit.prevent="sendMessage">
                                                <input
                                                    v-model="newMessage"
                                                    type="text"
                                                    placeholder="Type your message..."
                                                    class="w-full p-2 border-2 border-gray-300 rounded"
                                                />
                                                <button
                                                    type="submit"
                                                    class="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                                                >
                                                    Send
                                                </button>
                                            </form>
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

if (data) {
    directChats.value = data.value
}

const messages = [
    {
        id: 1,
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        href: '#',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online',
        message: 'Hey, what are you up to?',
        time: '2:30 PM',
    },
    // More messages...
]

const newMessage = ref('')

const sendMessage = () => {
    messages.push({
        id: messages.length + 1,
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        href: '#',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online',
        message: newMessage.value,
        //pm and am time
        time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }),
    })
    newMessage.value = ''
    //scroll to bottom
    const chatMessages = document.querySelector('.chat-messages')
    chatMessages.scrollTop = chatMessages.scrollHeight
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
