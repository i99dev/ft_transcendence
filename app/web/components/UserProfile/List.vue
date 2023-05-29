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
            <div v-if="!searchedUsers" class="absolute right-3 z-10 flex space-x-2">
                <div
                    v-if="props?.focusNowEabled && !focused"
                    class="text-white opacity-25 capitalize"
                >
                    ctrl + k
                </div>
                <svg
                    class="w-6 h-6 fill-none stroke-2 stroke-white"
                    viewBox="0 0 24 24"
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
                            user.username !== user_info.username ||
                            (user.username === user_info.username && props.isMe === true)
                        "
                        type="button"
                        @click="()=> handleUserSelection(user)"
                        class="p-2 border smooth-transition border-white rounded-xl relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2"
                        :class="{
                            'bg-background cursor-default': isUserDimmed(user.username),
                            'bg-background_light hover:bg-primary': !isUserDimmed(user.username),
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

const { user_info } = useUserInfo()
const searchedUsers = ref('')
const users = ref()
const focused = ref(false)

const props = defineProps([
    'isMe',
    'search',
    'unwantedUsers',
    'reset',
    'noFocus',
    'clear',
    'focusNow',
    'focusNowEabled',
])
const emit = defineEmits(['selectUser', 'lostFocus'])

watch(searchedUsers, async val => {
    if (!val) setUsersList([])
})
watch(
    () => props.clear,
    val => {
        if (val) {
            searchedUsers.value = ''
            document.getElementById('search-input')?.blur()
        }
    },
)
watch(
    () => props.focusNow,
    val => {
        if (val) {
            document.getElementById('search-input')?.focus()
            focused.value = true
        }
    },
)

onMounted(() => {
    setTimeout(() => {
        if (props?.search && !props?.noFocus) {
            document.getElementById('search-input')?.focus()
            focused.value = true
        }
    }, 1000)

    const searchInput = document.getElementById('search-input')
    if (searchInput) {
        searchInput.addEventListener('blur', () => {
            focused.value = false
        })
    }
})

const getFilteredUsers = async () => {
    if (!searchedUsers.value) return
    const { data } = await useUsersSearch(searchedUsers.value)
    setUsersList(data.value)
}

const isUserDimmed = (username: string) => {
    return props.unwantedUsers?.find((u: UserGetDto) => u.username === username)
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
