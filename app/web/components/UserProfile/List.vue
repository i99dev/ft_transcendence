<template>
  <div>
    <div class="">
      <div v-if="search" class="flex justify-start items-center pt-5 pb-2 relative">
        <input
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
      <div v-for="user in users"
          class="flex flex-col"
          x-descriptions="Tab component"
      >
        <button v-if="(user.login !== user_info.login) || (user.login === user_info.login && isMe === true)"
            type="button"
            @click="$emit('selectUser', user)"
            class="p-2 border-y border-slate-100 bg-slate-200 hover:bg-slate-100 relative"
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
</template>

<script setup>


const { user_info } = useUserInfo()

const { isMe, search } = defineProps(['isMe', 'search'])

const users = ref()
const {data} = await useUsers()
if (data)
  users.value = data.value
</script>
