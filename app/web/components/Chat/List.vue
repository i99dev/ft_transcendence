<template>
  <div class="border-y border-gray-200 h-full overflow-hidden">
      <div id="chat-list" class="overflow-y-scroll" style="max-height: 92vh; height: 92vh;">
          <!-- chat list -->
          <div
              class="flex flex-col"
              x-descriptions="Tab component"
          >

              <!-- chat element -->
              <button v-for="chat in chats"
                  @click="$emit('selectChat', chat)"
                  class="p-2 border-t border-slate-200 bg-slate-50 hover:bg-slate-100 flex relative w-full"
                  @mouseover="hoverButton = chat"
                  @mouseleave="hoverButton = null"
              >
                  <div class="relative" style="width: 10%;">
                    <img v-if="chatType === 'DM'"
                        :src="chat.users[0].image"
                        alt="User Photo"
                        class="rounded-full w-10 h-10 object-cover"
                    />
                    <img v-else
                        :src="chat.image"
                        alt="User Photo"
                        class="rounded-full w-10 h-10 object-cover"
                    />
                    <!-- online badge -->
                    <span v-if="chatType === 'DM' "
                    class="absolute bottom-1 left-8 block h-3 w-3 rounded-full bg-indigo-500 border-2 border-white"
                    />
                  </div>

                  <div class="flex justify-between" style="width: 90%;">
                    <div class="flex flex-col mx-4 w-1/2">
                      <div v-if="chatType === 'DM'" class="flex justify-start text-slate-700">{{ chat.users[0].username }}</div> <!-- there should be one user only -->
                      <div v-else class="flex justify-start text-slate-700">{{ chat.name }}</div>
    
                      <div class=" w-1/2 flex justify-start overflow-hidden whitespace-nowrap text-xs text-slate-400">
                        <span v-if="chatType === 'GROUP'">
                          {{ chat.chat_room.messages[0].sender_login }}:&ensp;
                        </span>
                        <span>
                          {{ chat.chat_room.messages[0].content }}
                        </span>
                      </div>
                    </div>
  
                    <button v-if="chatType === 'DM' && hoverButton === chat" class="absolute right-1/4 top-1/4 h-auto w-auto border rounded-full bg-indigo-400 hover:bg-indigo-600 ease-in-out transition duration-200 p-1"
                        @click.stop="challange">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-ping-pong" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12.718 20.713a7.64 7.64 0 0 1 -7.48 -12.755l.72 -.72a7.643 7.643 0 0 1 9.105 -1.283l2.387 -2.345a2.08 2.08 0 0 1 3.057 2.815l-.116 .126l-2.346 2.387a7.644 7.644 0 0 1 -1.052 8.864"></path>
                        <path d="M14 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M9.3 5.3l9.4 9.4"></path>
                      </svg>
                    </button>
                    <div class="text-xs text-slate-400 flex items-end">
                      {{
                        getDisplayDate(new Date(chat.chat_room.messages[0].created_at).getFullYear(),
                        new Date(chat.chat_room.messages[0].created_at).getMonth() + 1,
                        new Date(chat.chat_room.messages[0].created_at).getDate() -5
                        )
                      }}
                    </div>
                  </div>
              </button>
          </div>
        
        <!-- create group chat -->
        <div v-if="chatType === 'GROUP'">
          <div class="absolute bottom-10 right-10">
            <button
              type="button"
              @click="isChatCreateGroupOpened = true"
              class="rounded-full bg-blue-900 bg-opacity-60 p-4 font-medium text-white hover:bg-opacity-90 transition duration-200 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 5l0 14"></path>
                <path d="M5 12l14 0"></path>
              </svg>
            </button>
          </div>
          <ChatCreateGroup :isOpened="isChatCreateGroupOpened" @closeGroupChatCreation="isChatCreateGroupOpened = false" />
        </div>

      </div>
  </div>
</template>

<script lang="ts" setup>
import { Socket } from 'socket.io-client';

const chatSocket = useNuxtApp().chatSocket as Ref<Socket>
const chats = ref()
const chatType = ref()
const isChatCreateGroupOpened = ref(false)
const hoverButton = ref(null)
const emit = defineEmits(['closeNavBar', 'selectChat'])

const props = defineProps(['chatType'])


watch(()=>props.chatType, async () => {
  await setup()
})

onMounted(async () => {
  await setup()
  chatSocket.value.on('new-group-list', (payload) => {
    chats.value = payload.content
  })
})

const setup = async () => {
  const { data } = props.chatType === 'DM' ? await useDirectChats() : await useGroupChats()

  if (data) chats.value = data.value

  chatType.value = props.chatType
}

const challange = () => {
  emit('closeNavBar')
  // navigateTo('/play')
}

</script>

<style scoped>
#chat-list {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#chat-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}

</style>