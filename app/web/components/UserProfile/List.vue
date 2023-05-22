<template>
    <div>
        <div v-if="props.search" class="flex justify-start items-center pt-5 pb-2 relative">
            <input
                id="search-input"
                v-model="searchedUsers"
                @input="getFilteredUsers()"
                class="text-sm leading-none text-left text-white bg-background_light px-4 py-3 w-full border rounded border-secondary_light outline-none"
                type="text"
                placeholder="Search"
            />
            <svg
                class="absolute right-3 z-10 cursor-pointer stroke-2 stroke-white"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    stroke="#4B5563"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M21 21L15 15"
                    stroke="#4B5563"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </div>
        <div id="users-list" class="overflow-y-scroll h-auto" style="max-height: 70vh">
            <div>
                <div
                    v-for="user in users"
                    :key="user"
                    class="flex flex-col"
                    x-descriptions="Tab component"
                >
                    <button
                        v-if="
                            user.login !== user_info.login ||
                            (user.login === user_info.login && props.isMe === true)
                        "
                        type="button"
                        @click="handleUserSelection(user)"
                        class="p-2 border smooth-transition border-white bg-background_light rounded-xl relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2"
                        :class="{
                            'bg-background': isUserDimmed(user.login),
                            'hover:bg-primary': !isUserDimmed(user.login),
                            'cursor-default': isUserDimmed(user.login),
                        }"
                    >
                        <img :src="user.image" class="rounded-full w-10 h-10 object-cover" />
                        <div class="absolute top-2 left-16 block text-white">
                            {{ user.username }}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const { user_info } = useUserInfo()
const searchedUsers = ref('')

const props = defineProps(['isMe', 'search', 'unwantedUsers', 'reset'])
const emit = defineEmits(['selectUser'])

watch(searchedUsers, async val => {
    if (!val) setUsersList([])
})
const users = ref()

onMounted(() => {
    if (props.search) document.getElementById('search-input')?.focus()
})

const getFilteredUsers = async () => {
    if (!searchedUsers.value) return
    const { data } = await useUsersSearch(searchedUsers.value)
    setUsersList(data.value)
}

const isUserDimmed = (login: string) => {
    return props.unwantedUsers?.find((u: UserGetDto) => u.login === login)
}

const setUsersList = (usersList: UserGetDto[]) => {
    users.value = usersList
}

const handleUserSelection = (user: UserGetDto) => {
    if (props.reset) searchedUsers.value = ''
    emit('selectUser', user)
}

</script>

<style scoped>
#users-list {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#users-list::-webkit-scrollbar {
    display: none;
}
</style>
