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
                                            <div class="flex flex-row">
                                                <button class="border rounded-full bg-slate-400 hover:bg-slate-200 ease-in-out transition duration-200 p-2 mx-2"
                                                    :class="{'bg-white': chatType === 'GROUP'}"
                                                    @click="switchChatType('GROUP')">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users-group" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                        <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"></path>
                                                        <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                        <path d="M17 10h2a2 2 0 0 1 2 2v1"></path>
                                                        <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                        <path d="M3 13v-1a2 2 0 0 1 2 -2h2"></path>
                                                    </svg>
                                                </button>
                                                <button class="border rounded-full bg-slate-400 hover:bg-slate-200 ease-in-out transition duration-200 p-2 mx-2"
                                                    :class="{'bg-white': chatType === 'DM'}"
                                                    @click="switchChatType('DM')">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <ChatList v-if="chatListView"
                                        :chatType="chatType"
                                        @selectChat="switchChatView"
                                    />
                                    <ChatContent v-else
                                        :currentChat="currentChat"
                                        :chatType="chatType"
                                        @exitChat="switchChatView"
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

<script lang="ts" setup>
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
const chatType = ref('DM')

const switchChatType = (type: string) => {
    chatType.value = type
    chatListView.value = true
    currentChat.value = null
}

const switchChatView = async (chat: directChat | groupChat) => {
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

