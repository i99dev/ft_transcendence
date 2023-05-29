<template>
    <TransitionRoot as="template">
        <Dialog as="div" class="fixed inset-0 z-20 overflow-y-auto">
            <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            >
                <div
                    class="fixed inset-0 transition-opacity"
                    @click="
                        () => {
                            addFriendOpen = false
                        }
                    "
                >
                    <div class="absolute inset-0 bg-background_light opacity-50"></div>
                </div>
                <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div
                        class="inline-block align-bottom bg-background rounded-lg text-left text-white overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    >
                        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 class="text-lg leading-6 font-medium">Add Friend</h3>
                            <div class="mt-2">
                                <input
                                    v-model="friendNameToAdd"
                                    type="text"
                                    placeholder="Enter friend's name"
                                    class="w-full px-3 py-2 text-sm leading-4 bg-background_light border border-white rounded-md focus:outline-none focus:border-white focus:ring focus:ring-white focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                @click="addNewFriend"
                                type="button"
                                class="w-full centered capitalize rounded-md shadow-sm px-4 py-2 bg-secondary text-base font-medium hover:bg-primary smooth-transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                add
                            </button>
                            <button
                                @click="() => $emit('close')"
                                type="button"
                                class="mt-3 w-full centered capitalize rounded-md shadow-sm px-4 py-2 bg-background_light text-base font-medium hover:bg-secondary smooth-transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:mt-0 sm:w-auto sm:text-sm"
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { useFriends } from '../../composables/Friends/useFriends'
import { Dialog, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref } from 'vue'

const { addFriend } = await useFriends()
const friendNameToAdd = ref('')
const addFriendOpen = ref(true)
const emit = defineEmits(['close'])

function addNewFriend() {
    addFriend(friendNameToAdd.value)
    emit('close')
}
</script>
