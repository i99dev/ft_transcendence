<template>
    <div>
        <TransitionRoot as="template" :show="open">
            <Dialog as="div" class="relative z-10">
                <div class="fixed inset-0" />
    
                <div class="fixed inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <TransitionChild as="template"
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enter-from="translate-x-full" enter-to="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leave-from="translate-x-0" leave-to="translate-x-full">
                                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                                    <div
                                        class="flex min-h-screen flex-col bg-background shadow-xl rounded-2xl border"
                                    >
                                        <div class="pt-2">
                                            <div class="flex items-start justify-between mb-2">
                                                <div class="ml-3 flex items-center">
                                                    <button
                                                        type="button"
                                                        class="rounded-full p-2 bg-background_light text-white hover:text-primary ring-1 ring-white focus:outline-white hover:ring-primary hover:focus:outline-primary"
                                                        @click="setFriendsModalOpen(false)"
                                                    >
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <button
                                                    @click="add_new_friend"
                                                    class="p-2 m-1 mr-4 rounded relative bg-secondary hover:bg-primary smooth-transition self-end text-white"
                                                >
                                                    Add friend
                                                </button>
                                            </div>
                                        </div>
                                        <div class="border-y border-white h-full overflow-hidden text-white">
                                            <div id="friend-list" class="overflow-y-scroll h-70vh">
                                                <!-- friend list -->
                                                <div class="flex flex-col" x-descriptions="Tab component">
                                                    <!-- Friend element -->
                                                    <div
                                                        v-for="friend in friends_list"
                                                        :key="friend?.id"
                                                        class="p-2 border-t border-white bg-background_light hover:bg-secondary smooth-transition flex justify-between items-center relative w-full focus:outline-secondary"
                                                    >
                                                        <button
                                                            class="centered w-fit group"
                                                            @click="navigateTo(`/users/${friend.name}`)"
                                                        >
                                                            <div class="relative">
                                                                <img
                                                                    :src="friend.photo"
                                                                    alt="User Photo"
                                                                    class="rounded-full w-10 h-10 object-cover"
                                                                />
                                                                <!-- online badge -->
                                                                <UserProfileStatus
                                                                    :status="friend.status"
                                                                    class="absolute bottom-0 right-0 w-3 h-3"
                                                                />
                                                            </div>
                                                            <div class="m-2 font-medium capitalize whitespace-nowrap group-hover:scale-110 smooth-transition">
                                                                {{ friend?.name }}
                                                            </div>
                                                        </button>
                                                        <div class="p-2 group rounded-full centered smooth-transition h-8 aspect-square relative">
                                                            <Menu>
                                                                <MenuButton>
                                                                    <EllipsisVerticalIcon
                                                                        class="w-6 h-6 text-white group-hover:scale-125 smooth-transition transition-colors duration-200"
                                                                    />
                                                                </MenuButton>
                                                                <MenuItems
                                                                    class="absolute top-0 right-6 z-10 w-32 mt-2 origin-top-right bg-background_light border divide-white rounded-md shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none"
                                                                >
                                                                    <div class="py-1">
                                                                        <MenuItem
                                                                            class="text-white block px-4 py-2 text-sm cursor-pointer hover:bg-primary smooth-transition centered"
                                                                            @click="
                                                                                viewProfile(
                                                                                    friend.name,
                                                                                )
                                                                            "
                                                                        >
                                                                            <span
                                                                                class="flex items-center"
                                                                            >
                                                                                View Profile
                                                                            </span>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            class="text-white block px-4 py-2 text-sm cursor-pointer hover:bg-primary smooth-transition centered"
                                                                            @click="
                                                                                sendMsg(
                                                                                    friend.name,
                                                                                )
                                                                            "
                                                                        >
                                                                            <span
                                                                                class="flex items-center"
                                                                            >
                                                                                Send MSG
                                                                            </span>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            class="text-white block px-4 py-2 text-sm cursor-pointer hover:bg-primary smooth-transition centered"
                                                                            @click="
                                                                                remove(
                                                                                    friend.name,
                                                                                )
                                                                            "
                                                                        >
                                                                            <span
                                                                                class="flex items-center"
                                                                            >
                                                                                Remove
                                                                            </span>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            class="text-white block px-4 py-2 text-sm cursor-pointer hover:bg-primary smooth-transition centered"
                                                                            @click="
                                                                                block(
                                                                                    friend.name,
                                                                                )
                                                                            "
                                                                        >
                                                                            <span
                                                                                class="flex items-center"
                                                                            >
                                                                                Block
                                                                            </span>
                                                                        </MenuItem>
                                                                    </div>
                                                                </MenuItems>
                                                            </Menu>
                                                        </div>
                                                    </div>          
                                                </div>
                                            </div>
                                            <div class="border-t-1 h-20vh">
                                                <div
                                                    v-for="(notification, index) in notifications"
                                                    :key="notification.id"
                                                >
                                                    <FriendsNotification
                                                        :notification="notification"
                                                        @close="removeNotification(index)"
                                                    />
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
        <FriendsAddFriendBox :show="addFriendOpen" @close="addFriendOpen = false" class="z-20" />
    </div>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import { useFriends } from '../../composables/Friends/useFriends'
import { useNotifications } from '../../composables/Notifications/useNotifications'
import { ref, computed } from 'vue'

const addFriendOpen = ref(false)
const { friends_info, setFriendsModalOpen, setupSocketHandlers, notifications, removeFriend } =
    await useFriends()
const open = computed(() => friends_info.value?.friendsModalOpen)
const friends_list = computed(() => friends_info.value?.friends)
const { deleteNotification } = await useNotifications()

setupSocketHandlers()

function add_new_friend() {
    addFriendOpen.value = true
}

function viewProfile(name: string) {
    navigateTo(`/users/${name}`)
}

function sendMsg(name: string) { }

function remove(name: string) {
    removeFriend(name)
}

function block(name: string) { }

const removeNotification = (index: number) => {
    if (notifications.value && notifications.value[index]) {
        deleteNotification(notifications.value[index].id)
    }
    notifications.value?.splice(index, 1)
}
</script>

<style scoped>
#friend-list {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#friend-list::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
</style>