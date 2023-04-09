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
                                    <!-- <div v-if="chatListView" class="border-y mt-2 border-gray-200 h-full">
                                        <div class=" overflow-y-auto" style="max-height: 92vh; height: 92vh;">
                                            <div
                                                class="flex flex-col"
                                                x-descriptions="Tab component"
                                            >

                                                <button v-for="item in directChats"
                                                    @click="() => switchChatView(item)"
                                                    class="p-2 border-y border-slate-100 bg-slate-200 hover:bg-slate-100 relative"
                                                >
                                                    <img
                                                        :src="item.users[1].image"
                                                        alt="User Photo"
                                                        class="rounded-full w-10 h-10 object-cover"
                                                    />
                                                    <span
                                                    class="absolute bottom-2 left-9 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                                                    />
                                                    <div class="absolute top-2 left-16 block text-slate-700">{{ item.users[1].username }}</div>
                                                </button>
                                            
                                            </div>
                                        </div>
                                    </div> -->
                                    <ChatList v-if="chatListView" @selectChat="switchChatView" />
                                    <!-- Chat view -->
                                    <Chat v-else
                                        :currentChat="currentChat"
                                        @exitChat="switchChatView()"
                                    />
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

const chatListView = ref(true)
const currentChat = ref()

const switchChatView = async (chat) => {
    if (chat) {
        chatListView.value = false
        currentChat.value = chat
    }
    else {
        chatListView.value = true
        currentChat.value = null
    }
}

const open = computed(() => chat_info.value.chatModalOpen)
</script>

