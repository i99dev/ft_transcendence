<template>
  <div>
    <div v-if="search" class="flex justify-start items-center pt-5 pb-2 relative">
        <input
          id="search-input"
          v-model="searchedUsers"
          @input="getFilteredUsers()"
          class="text-sm leading-none text-left text-gray-600 px-4 py-3 w-full border rounded border-gray-300 outline-none"
          type="text"
          placeholder="Search"
        />
        <svg
          class="absolute right-3 z-10 cursor-pointer"
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
    <div id="users-list" class="overflow-y-scroll h-auto" style="max-height: 70vh;">
      
      <div>
        <div v-for="user in users"
            class="flex flex-col"
            x-descriptions="Tab component"
        >
          <button v-if="(user.login !== user_info.login) || (user.login === user_info.login && isMe === true)"
              type="button"
              @click="$emit('selectUser', user)"
              class="p-2 border-y border-slate-100 bg-slate-100 rounded-xl relative mb-1 focus:outline-indigo-400 focus:-outline-offset-2"
              :class="{
                'bg-slate-300': isUserDimmed(user.login),
                'hover:bg-indigo-100': !isUserDimmed(user.login),
                'cursor-default': isUserDimmed(user.login)
              }"
          >
            <img
                    :src="user.image"
                    class="rounded-full w-10 h-10 object-cover"
            />
            <div class="absolute top-2 left-16 block text-slate-700">{{ user.username }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>


const { user_info } = useUserInfo()
const dimmedUsers = ref([] as ChatUser[])
const searchedUsers = ref('')

const { isMe, search, unwantedUsers } = defineProps(['isMe', 'search', 'unwantedUsers'])

watch(searchedUsers, async (val) => {
  if (val === '') {
    users.value = allUsers.value
  }
})
const {data: allUsers} = await useUsers()
const users = ref()

onMounted(()=> {
  if (allUsers)
    users.value = allUsers.value

  if (unwantedUsers) dimmedUsers.value = unwantedUsers

  if (search) document.getElementById('search-input')?.focus()
})

const getFilteredUsers = async () => {
  const {data} = await useUsersSearch(searchedUsers.value)
  users.value = data.value
}

const isUserDimmed = (login: string) => {
  return dimmedUsers.value.find((u: ChatUser) => u.user_login === login)
}

</script>

<style scoped>
#users-list {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#users-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}

</style>