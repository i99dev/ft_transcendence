<template>
    <div class="w-full max-w-lg px-4 h-screen">
        <div class="overflow-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div
                id="chat-participants"
                class="relative flex gap-8 bg-background p-7 flex-col h-auto overflow-y-scroll"
                style="max-height: 70vh"
            >
                <TransitionRoot appear :show="isAdminOptionsOpened" as="template">
                    <Dialog as="div" @close="closeAdminOptionsPopup" class="relative z-10">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="fixed inset-0 bg-black bg-opacity-25" />
                        </TransitionChild>

                        <div class="fixed inset-0">
                            <div
                                class="absolute w-80 top-1/4 right-10 min-h-full items-center justify-end p-4 text-center"
                            >
                                <TransitionChild
                                    as="template"
                                    enter="duration-300 ease-out"
                                    enter-from="opacity-0 scale-95"
                                    enter-to="opacity-100 scale-100"
                                    leave="duration-200 ease-in"
                                    leave-from="opacity-100 scale-100"
                                    leave-to="opacity-0 scale-95"
                                >
                                    <DialogPanel
                                        class="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all"
                                    >
                                        <h1
                                            class="p-2 border-b border-tertiary text-white font-semibold flex justify-center mb-2"
                                        >
                                            {{ participant.user.username }}
                                        </h1>
                                        <button
                                            v-for="option in adminOptions"
                                            :key="option.action"
                                            class="flex items-center p-2 w-full rounded-lg hover:bg-tertiary text-white"
                                            @click="setUser(option.action)"
                                        >
                                            {{ option.text }}
                                        </button>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </TransitionRoot>

                <TransitionRoot appear :show="isAddUserOpened" as="template">
                    <Dialog as="div" @close="closeAddUsersPopup" class="relative z-10">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="fixed inset-0 bg-background bg-opacity-25" />
                        </TransitionChild>

                        <div class="fixed inset-0 overflow-y-auto">
                            <div
                                class="flex min-h-full items-center justify-center p-4 text-center"
                            >
                                <TransitionChild
                                    as="template"
                                    enter="duration-300 ease-out"
                                    enter-from="opacity-0 scale-95"
                                    enter-to="opacity-100 scale-100"
                                    leave="duration-200 ease-in"
                                    leave-from="opacity-100 scale-100"
                                    leave-to="opacity-0 scale-95"
                                >
                                    <DialogPanel
                                        class="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all"
                                    >
                                        <div
                                            v-for="user in users"
                                            :key="user.username"
                                            class="flex-row inline-flex flex-nowrap"
                                        >
                                            <button
                                                class="border rounded-full bg-background ease-in-out transition duration-200 m-2 relative"
                                                @click="removeUser(user)"
                                            >
                                                <img
                                                    class="rounded-full w-8 h-8 object-cover"
                                                    :src="user.image"
                                                    :alt="user.username"
                                                />
                                                <div
                                                    class="absolute -right-1 -bottom-1 rounded-full p-1 bg-background_light"
                                                >
                                                    <XMarkIcon class="h-2 w-2" aria-hidden="true" />
                                                </div>
                                            </button>
                                        </div>
                                        <UserProfileList
                                            @selectUser="selectUser"
                                            :search="true"
                                            :unwantedUsers="participants"
                                        />
                                        <div class="flex justify-end mt-2">
                                            <button
                                                class="flex-shrink-0 bg-tertiary hover:bg-primary text-white py-1 px-2 rounded capitalize"
                                                type="button"
                                                @click="addUsers"
                                            >
                                                add
                                            </button>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </TransitionRoot>

                <div class="text-md font-semibold centered">
                    <button
                        class="mx-4 transition-all ease-in-out duration-200 underline underline-offset-8"
                        :class="{
                            'scale-125': participantsType === 'NORMAL',
                            'text-primary': participantsType === 'NORMAL',
                            'opacity-70': participantsType !== 'NORMAL',
                        }"
                        @click="updateParticipants()"
                    >
                        Participants
                    </button>
                    <button
                        class="mx-4 transition-all ease-in-out duration-200 underline underline-offset-8"
                        @click="updateParticipants('BAN')"
                        :class="{
                            'scale-125': participantsType === 'BAN',
                            'text-primary': participantsType === 'BAN',
                            'opacity-70': participantsType !== 'BAN',
                        }"
                    >
                        Banned
                    </button>
                </div>
                <div
                    v-for="participant in participants"
                    :key="participant.user.username"
                    class="relative w-full pl-3 z-10 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-tertiary focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                >
                    <button
                        @click="openAdminOptionsPopup(participant)"
                        class="relative w-full -m-3 flex items-center rounded-lg p-2 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12 bg-background_light p-1 rounded-full"
                        >
                            <img
                                :src="participant.user.image"
                                :alt="participant.user.username"
                                class="rounded-full w-10 h-10 object-cover"
                            />
                        </div>
                        <div class="flex justify-between w-full">
                            <div class="ml-4">
                                <div
                                    v-if="participant.user_login === user_info.login"
                                    class="font-medium text-white capitalize"
                                >
                                    you
                                </div>
                                <div v-else class="font-medium text-white">
                                    {{ participant.user.username }}
                                </div>
                            </div>
                            <div
                                v-if="participant.role !== 'MEMBER'"
                                class="text-white font-bold text-sm"
                            >
                                {{ participant.role }}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div class="bg-background_light p-4">
                <div
                    class="flex justify-center rounded-md px-2 py-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                >
                    <button
                        v-if="CanAddUsers()"
                        class="border rounded-full hover:bg-primary ease-in-out transition duration-200 p-2 mx-4"
                        @click="isAddUserOpened = true"
                    >
                        <UserPlusIcon class="w-6 h-6" />
                    </button>
                    <button
                        class="border rounded-full hover:bg-tertiary ease-in-out transition duration-200 p-2 mx-4"
                        @click="exitChat"
                    >
                        <ArrowRightOnRectangleIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, watch } from 'vue'

const { chatSocket } = useChatSocket()
watch(chatSocket, async () => {
    socketOn()
})

const { participants, participantsType, setParticipantsType, setParticipants, updateParticipants } =
    useGroupChatParticipants()
const participant = ref({} as ChatUser)
const adminOptions = ref([
    {
        action: participant.value?.role === 'ADMIN' ? 'downgrade' : 'upgrade',
        text: participant.value?.role === 'ADMIN' ? 'Dismiss as admin' : 'Make group admin',
    },
    {
        action: 'mute',
        text: 'Mute',
    },
    {
        action: 'ban',
        text: 'Ban',
    },
    {
        action: 'kick',
        text: 'Remove',
    },
])
const isAdminOptionsOpened = ref(false)
const isAddUserOpened = ref(false)

const { user_info } = useUserInfo()
const { currentChat } = useCurrentChat()

const users = ref([] as UserGetDto[])

onMounted(() => {
    socketOn()
})

const socketOn = () => {
    chatSocket.value?.on('group-chat-users', (payload: ChatUser[]) => {
        setParticipants(payload)
        setParticipantsType('NORMAL')
    })
    chatSocket.value?.on('group-chat-banned-users', (payload: ChatUser[]) => {
        setParticipantsType('BAN')
        setParticipants(payload)
    })
}

const setAdminOptions = () => {
    if (participant.value.status === 'BAN') {
        adminOptions.value = []
        adminOptions.value[0] = {
            action: 'reset',
            text: 'Unban',
        }
        return
    }

    // check whether participant is admin to downgrade hime or not to upgrade him
    adminOptions.value[0].action = participant.value?.role === 'ADMIN' ? 'downgrade' : 'upgrade'
    adminOptions.value[0].text =
        participant.value?.role === 'ADMIN' ? 'Dismiss as admin' : 'Make group admin'

    // check if participant is OWNER to change ownership
    const myRole = participants.value?.find(
        chatUser => chatUser.user_login === user_info.value?.login,
    )?.role
    if (myRole === 'OWNER' && participant.value?.role === 'ADMIN')
        adminOptions.value?.unshift({
            action: 'owner',
            text: 'Pass ownership',
        })
}

const resetAdminOptions = () => {
    adminOptions.value = [
        {
            action: participant.value?.role === 'ADMIN' ? 'downgrade' : 'upgrade',
            text: participant.value?.role === 'ADMIN' ? 'Dismiss as admin' : 'Make group admin',
        },
        {
            action: 'mute',
            text: 'Mute',
        },
        {
            action: 'ban',
            text: 'Ban',
        },
        {
            action: 'kick',
            text: 'Remove',
        },
    ]
}

const openAdminOptionsPopup = (chatUser: ChatUser) => {
    const myChatUser = participants.value?.find(
        chatUser => chatUser.user_login === user_info.value?.login,
    )
    if (
        chatUser.user_login === user_info.value?.login ||
        chatUser.role === 'OWNER' ||
        myChatUser?.role === 'MEMBER'
    )
        return
    participant.value = chatUser
    setAdminOptions()
    isAdminOptionsOpened.value = true
}

const closeAdminOptionsPopup = () => {
    isAdminOptionsOpened.value = false
    setTimeout(() => {
        resetAdminOptions()
    }, 200)
}

const closeAddUsersPopup = () => {
    setTimeout(() => {
        users.value = []
    }, 200)
    isAddUserOpened.value = false
}

const setUser = (action: string) => {
    if (action === 'upgrade' || action === 'downgrade' || action === 'owner') {
        chatSocket.value?.emit(
            'admin-group-chat',
            JSON.stringify({
                room_id: currentChat.value?.chat_room_id,
                user_login: participant.value?.user_login,
                action: action,
            }),
        )
    } else
        chatSocket.value?.emit(
            'user-group-chat',
            JSON.stringify({
                room_id: currentChat.value?.chat_room_id,
                user_login: participant.value?.user_login,
                action: action,
            }),
        )
    closeAdminOptionsPopup()
}

const exitChat = () => {
    chatSocket.value?.emit(
        'exit-group-chat',
        JSON.stringify({ room_id: currentChat.value?.chat_room_id }),
    )
}

const addUsers = () => {
    for (let i = 0; i < users.value?.length; i++) {
        chatSocket.value?.emit(
            'user-group-chat',
            JSON.stringify({
                room_id: currentChat.value?.chat_room_id,
                user_login: users.value[i].login,
                action: 'add',
            }),
        )
    }
    closeAddUsersPopup()
}

const selectUser = (user: UserGetDto) => {
    if (
        !users.value?.find(u => u.login === user.login) &&
        user.login !== user_info.value?.login &&
        !participants.value?.find(p => p.user_login === user.login)
    )
        users.value?.push(user)
}

const removeUser = (user: UserGetDto) => {
    users.value = users.value?.filter(u => u.id !== user.id)
}

const CanAddUsers = () => {
    if (participants.value)
        for (let i = 0; i < participants.value?.length; i++)
            if (
                participants.value[i].user_login === user_info.value?.login &&
                participants.value[i].role !== 'MEMBER'
            )
                return true

    return false
}
</script>

<style scoped>
#chat-participants {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#chat-participants::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
</style>
