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
                                    <ChatList v-if="chatListView"
                                        @selectChat="switchChatView"
                                    />
                                    <Chat v-else
                                        :currentChat="currentChat"
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

