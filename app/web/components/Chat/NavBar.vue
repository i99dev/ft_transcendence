<template>
    <div>
        <TransitionRoot as="template" :show="open">
            <Dialog as="div" class="relative z-10">
                <div class="fixed inset-0" />

                <div class="fixed inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <div
                            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
                        >
                            <TransitionChild
                                as="template"
                                enter="duration-300 ease-out"
                                enter-from="opacity-0"
                                enter-to="opacity-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100"
                                leave-to="opacity-0"
                            >
                                <div class="fixed inset-0 bg-background bg-opacity-40" />
                            </TransitionChild>
                            <TransitionChild
                                as="template"
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enter-from="translate-x-full"
                                enter-to="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leave-from="translate-x-0"
                                leave-to="translate-x-full"
                            >
                                <DialogPanel class="pointer-events-auto w-screen max-w-md z-10">
                                    <div
                                        class="flex min-h-screen flex-col bg-background shadow-xl rounded-2xl border"
                                    >
                                        <div class="pt-2">
                                            <div class="flex items-start justify-between">
                                                <div class="ml-3 flex items-center">
                                                    <button
                                                        type="button"
                                                        class="rounded-full p-2 bg-background_light text-white hover:text-primary ring-1 ring-white focus:outline-white hover:ring-primary hover:focus:outline-primary"
                                                        @click="
                                                            () => setChatModalOpen(false)
                                                        "
                                                    >
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon
                                                            class="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                                <ChatOptions />
                                            </div>
                                        </div>
                                        <ChatList v-if="chatView" @showInvite="showInviteModal" />
                                        <ChatContent
                                            v-else
                                            @closeNavBar="setChatModalOpen(false)"
                                        />
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue'

const { chat_info, setChatModalOpen, send_message } = useChat()

const { chatView, setChatView } = useChatView()
const { currentChat, setCurrentChat } = useCurrentChat()
const { chatType } = useChatType()
const { showInviteModal } = await useGameInvite()

watch(
    () => chatType.value,
    () => {
        setChatView(true)
        setCurrentChat(null)
    },
)

watch(
    () => currentChat.value,
    () => {
        if (currentChat.value && chatType.value) {
            setChatView(false)
        } else {
            setChatView(true)
        }
    },
)

const open = computed(() => chat_info.value?.chatModalOpen)
</script>
