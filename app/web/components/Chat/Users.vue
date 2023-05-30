<template>
    <MainPopup :show="props?.show" @closeMainPopup="closePopup">
        <div v-for="user in users" :key="user.username" class="flex-row inline-flex flex-nowrap">
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
                    class="absolute -right-1 -bottom-1 rounded-full p-1 bg-white text-primary hover:bg-primary hover:text-white smooth-transition"
                >
                    <XMarkIcon class="h-2 w-2" aria-hidden="true" />
                </div>
            </button>
        </div>
        <UserProfileList @selectUser="selectUser" :search="true" :unwantedUsers="unwantedUsers" />
        <div class="flex justify-end mt-2">
            <button
                v-if="props.cancelButton"
                class="flex-shrink-0 border-transparent border-4 text-white hover:text-primary text-sm py-1 px-2 rounded capitalize focus:outline-white"
                type="button"
                @click="closePopup('cancel')"
            >
                {{ props.cancelButton || 'cancel' }}
            </button>
            <button
                class="flex-shrink-0 bg-secondary hover:bg-primary text-white py-1 px-2 rounded capitalize"
                type="button"
                @click="sendUsersList"
            >
                {{ props.addButton || 'add' }}
            </button>
        </div>
    </MainPopup>
</template>

<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['participants', 'show', 'addButton', 'cancelButton'])
const emit = defineEmits(['usersList', 'closePopup', 'cancel'])

const { user_info } = useUserInfo()
const users = ref([] as UserGetDto[])
const unwantedUsers = ref([] as UserGetDto[])

onMounted(() => {
    if (props.participants) unwantedUsers.value = props.participants?.map((a: ChatUser) => a.user)
})

const reset = () => {
    users.value = []
    unwantedUsers.value = []
}

onUnmounted(() => {
    closePopup()
})

const sendUsersList = () => {
    emit('usersList', users.value)
    reset()
}

const selectUser = (user: UserGetDto) => {
    if (
        !users.value?.find(u => u.login === user.login) &&
        user.login !== user_info.value?.login &&
        !props.participants?.find((p: ChatUser) => p.user_login === user.login)
    ) {
        unwantedUsers.value?.push(user)
        users.value?.push(user)
    }
}

const removeUser = (user: UserGetDto) => {
    unwantedUsers.value = unwantedUsers.value?.filter(u => u.id !== user.id)
    users.value = users.value?.filter(u => u.id !== user.id)
}

const closePopup = (action: 'usersList' | 'closePopup' | 'cancel' = 'closePopup') => {
    setTimeout(() => {
        reset()
    }, 200)
    emit(action)
}
</script>
