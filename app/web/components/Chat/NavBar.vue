<template>
    <div>
        <CommonSideBar :show="open">
            <div
                class="flex h-screen flex-col bg-background shadow-xl rounded-2xl border overflow-hidden"
            >
                <div class="pt-2 mb-2 h-16">
                    <div class="flex items-center justify-between">
                        <div class="ml-3">
                            <button
                                type="button"
                                class="rounded-full p-2 bg-background_light text-white hover:text-primary ring-1 ring-white focus:outline-white hover:ring-primary hover:focus:outline-primary"
                                @click="setChatModalOpen(false)"
                            >
                                <span class="sr-only">Close panel</span>
                                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <ChatOptions />
                    </div>
                </div>
                <div class="h-full">
                    <ChatList v-if="chatView" @showInvite="showInviteModal" />
                    <ChatContent v-else @closeNavBar="setChatModalOpen(false)" />
                </div>
            </div>
        </CommonSideBar>
    </div>
</template>

<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { chat_info, setChatModalOpen } = useChat()

const { chatView } = useChatView()
const { showInviteModal } = await useGameInvite()

const open = computed(() => chat_info.value?.chatModalOpen)
</script>
