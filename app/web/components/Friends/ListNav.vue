<template>
    <div>
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
                                        <div class="flex-grow">
                                            <div class="pt-2">
                                                <div class="flex items-start justify-between">
                                                    <div class="ml-3 flex items-center">
                                                        <button
                                                            type="button"
                                                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                                            @click="setFriendsModalOpen(false)"
                                                        >
                                                            <span class="sr-only">Close panel</span>
                                                            <XMarkIcon
                                                                class="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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
                                                            Add friend
                                                        </button>
                                                    </nav>
                                                </div>
                                            </div>
                                            <div class="border-b border-gray-200">
                                                <div class="px-5">
                                                    <nav
                                                        class="overflow-y-auto max-h-screen -mb-px flex flex-col space-y-1"
                                                        x-descriptions="Tab component"
                                                    >
                                                        <div
                                                            v-for="friend in friends_list"
                                                            :key="friend.id"
                                                            class="p-2 bg-white flex flex-row justify-between transition-colors duration-200"
                                                        >
                                                            <div class="flex flex-row items-center">
                                                                <div class="relative">
                                                                    <img
                                                                        :src="friend.photo"
                                                                        alt="User Photo"
                                                                        class="border border-gray-200 rounded-full w-12 h-12"
                                                                    />
                                                                    <!-- Color is green when status = online, blue if status = INGAME OR INQUEUE , gray if status=OFFLINE-->
                                                                    <span
                                                                        class="absolute bottom-0 left-0 block h-3 w-3 rounded-full border-2 border-white"
                                                                        :class="{
                                                                            'bg-green-500':
                                                                                friend.status ===
                                                                                'ONLINE',
                                                                            'bg-blue-500':
                                                                                friend.status ===
                                                                                    'INQUEUE' ||
                                                                                friend.status ===
                                                                                    'INGAME',
                                                                            'bg-gray-500':
                                                                                friend.status ===
                                                                                'OFFLINE',
                                                                        }"
                                                                    />
                                                                </div>
                                                                <div
                                                                    class="text-start self-center pl-4"
                                                                >
                                                                    {{ friend.name }}
                                                                </div>
                                                            </div>
                                                            <div class="self-center">
                                                                <Menu>
                                                                    <MenuButton>
                                                                        <EllipsisVerticalIcon
                                                                            class="w-6 h-6 text-gray-500 hover:text-gray-900 transition-colors duration-200"
                                                                        />
                                                                    </MenuButton>
                                                                    <MenuItems
                                                                        class="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                                    >
                                                                        <div class="py-1">
                                                                            <MenuItem
                                                                                class="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
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
                                                                                class="text-gray-200 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
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
                                                                                class="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
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
                                                                                class="text-gray-200 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
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
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
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

<script setup lang='ts'>
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
const open = computed(() => friends_info.value.friendsModalOpen)
const friends_list = computed(() => friends_info.value.friends)
const { deleteNotification } = await useNotifications()

setupSocketHandlers()

function add_new_friend() {
    addFriendOpen.value = true
}

function viewProfile(name: string) {
    navigateTo(`/users/${name}`)
}

function sendMsg(name: string) {}

function remove(name: string) {
    removeFriend(name)
}

function block(name: string) {}

const removeNotification = (index: number) => {
    if (notifications.value && notifications.value[index]) {
        deleteNotification(notifications.value[index].id)
    }
    notifications.value?.splice(index, 1)
}
</script>
