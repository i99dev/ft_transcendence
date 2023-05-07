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
                                                    @click="setFriendsModalOpen(false)"
                                                >
                                                    <span class="sr-only">Close panel</span>
                                                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Strat friends list -->
                                    <!-- button to add friends -->
                                    <div class="border-b border-gray-200">
                                        <div class="px-6">
                                            <nav
                                                class="-mb-px flex space-x-6 justify-end pb-4"
                                                x-descriptions="Tab component"
                                            >
                                                <button
                                                    @click="add_new_friend"
                                                    class="p-2 rounded relative bg-blue-500 self-end text-white"
                                                >
                                                    Add friends
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                    <!-- friends list -->
                                    <div class="border-b border-gray-200">
                                        <div class="px-6">
                                            <nav
                                                class="-mb-px flex space-x-6 flex-col"
                                                x-descriptions="Tab component"
                                            >
                                                <div
                                                    v-for="friend in friends_list"
                                                    :key="friend.id"
                                                    class="p-2 rounded-full bg-white flex flex-row justify-between"
                                                >
                                                    <div class="flex flex-row">
                                                        <div class="relative">
                                                            <img
                                                                :src="friend.photo"
                                                                alt="User Photo"
                                                                class="rounded-full w-10 h-10"
                                                            />
                                                            <!-- online badge -->
                                                            <span
                                                                class="absolute bottom-0 left-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                                                            />
                                                        </div>
                                                        <div class="text-start self-center pl-2">
                                                            {{ friend.name }}
                                                        </div>
                                                    </div>
                                                    <div class="self-center">
                                                        <!-- burger menu -->
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="w-6 h-6"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                    <!-- End friendds list -->
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
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { friends_info, setFriendsModalOpen, add_friend } = useFriends()

const open = computed(() => friends_info.value.friendsModalOpen)
const friends_list = computed(() => friends_info.value.friends)
function add_new_friend() {}
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
