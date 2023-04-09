<template>
  <div class="border-y border-gray-200 h-full">
      <div class="overflow-y-auto" style="max-height: 92vh; height: 92vh;">
          <!-- chat list -->
          <div
              class="flex flex-col"
              x-descriptions="Tab component"
          >

              <!-- chat element -->
              <button v-for="chat in chats"
                  @click="$emit('selectChat', chat)"
                  class="p-2 border-y border-slate-100 bg-slate-200 hover:bg-slate-100 relative"
              >
                  <img v-if="chatType === 'DM'"
                      :src="chat.users[1].image"
                      alt="User Photo"
                      class="rounded-full w-10 h-10 object-cover"
                  />
                  <img v-else
                      :src="chat.image"
                      alt="User Photo"
                      class="rounded-full w-10 h-10 object-cover"
                  />
                  <!-- online badge -->
                  <span
                  class="absolute bottom-2 left-9 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                  />
                  <div v-if="chatType === 'DM'" class="absolute top-2 left-16 block text-slate-700">{{ chat.users[1].username }}</div>
                  <div v-else class="absolute top-2 left-16 block text-slate-700">{{ chat.name }}</div>
              </button>
          </div>
        
        <!-- create group chat -->
        <div v-if="chatType === 'GROUP'">
          <div class="absolute bottom-10 right-10">
            <button
              type="button"
              @click="isOpen = true"
              class="rounded-full bg-blue-900 bg-opacity-60 p-4 font-medium text-white hover:bg-opacity-90 transition duration-200 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 5l0 14"></path>
                <path d="M5 12l14 0"></path>
              </svg>
            </button>
          </div>
          <ChatCreateGroup :isOpen="isOpen" @closeGroupChatCreation="isOpen = false" />
        </div>

      </div>
  </div>
</template>

<script lang="ts" setup>

const chats = ref()
const chatType = ref()
const isOpen = ref(false)

const props = defineProps(['chatType'])


watch(()=>props.chatType, async () => {
  await setup()
})

onMounted(async () => {
  await setup()
})

const setup = async () => {
  const { data } = props.chatType === 'DM' ? await useDirectChats() : await useGroupChats()
  
  if (data) chats.value = data.value

  chatType.value = props.chatType
}



</script>
