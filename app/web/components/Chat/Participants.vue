<template>
  <div class="w-full max-w-lg px-4 h-screen">
    <div
      class="overflow-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div 
        id="chat-participants"
        class="relative flex gap-8 bg-white p-7 flex-col h-auto overflow-y-scroll "
        style="max-height: 70vh;"
      >

      <TransitionRoot appear :show="isOpened" as="template">
          <Dialog as="div" @close="closePopup" class="relative z-10">
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
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <h1 class=" p-2 border-b border-indigo-500 text-indigo-500 font-semibold flex justify-center mb-2">
                      {{ participant.user.username }}
                    </h1>
                    <button
                      v-for="option in adminOptions"
                      class="flex items-center p-2 w-full rounded-lg hover:bg-indigo-500 hover:text-white"
                      @click="closePopup"
                    >
                      {{ option.text }}
                    </button>
                   </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>


      <div
          v-for="participant in participants.chat_user"
          :key="participant.user.username"
          class="relative w-full pl-3 z-10 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
        
      >
          <button
              @click="openPopup(participant)"
              class="relative w-full -m-3 flex items-center rounded-lg p-2 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12 bg-slate-200 p-1 rounded-full"
          >
              <img
                :src="participant.user.image"
                :alt="participant.user.username"
                class="rounded-full w-10 h-10 object-cover"
              >
          </div>
          <div class="flex justify-between w-full">
            <div class="ml-4">
              <div v-if="participant.user_login === user_info.login" class="font-medium text-gray-900 capitalize">
                you
              </div>
              <div v-else class=" font-medium text-gray-900">
                {{ participant.user.username }}
              </div>
            </div>
            <div
              v-if="participant.role !== 'MEMBER'"
              class="text-indigo-500 text-sm"
            >
              {{ participant.role }}
            </div>
          </div>
          </button>
      </div>
      </div>
      <div class="bg-gray-50 p-4">
        <div
          class="flex justify-center rounded-md px-2 py-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
        >
          <button class="border rounded-full hover:bg-blue-200 ease-in-out transition duration-200 p-2 mx-4"
            @click="">
            <UserPlusIcon class="w-6 h-6" />
          </button>
          <button class="border rounded-full hover:bg-red-200 ease-in-out transition duration-200 p-2 mx-4"
            @click="exitChat">
            <ArrowRightOnRectangleIcon class="w-6 h-6" />
          </button>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['currentChat', 'participants'])
const participants = ref({} as groupChat)
const participant = ref({} as ChatUser)
const adminOptions = ref([
  {
    action: participant.value.role === 'ADMIN' ? 'downgrade' : 'upgrade',
    text: participant.value.role === 'ADMIN' ? 'Dismiss as admin' : 'Make group admin',
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
const isOpened = ref(false)

const {user_info} = useUserInfo()

onMounted(()=>{
  if (props.participants) participants.value = props.participants
})

const setAdminOptions = () => {
  adminOptions.value[0].action = participant.value.role === 'ADMIN' ? 'downgrade' : 'upgrade'
  adminOptions.value[0].text = participant.value.role === 'ADMIN' ? 'Dismiss as admin' : 'Make group admin'
}

const openPopup = (chatUser : ChatUser) => {
  const myChatUser = participants.value.chat_user.find((chatUser) => chatUser.user_login === user_info.value.login)
  if (chatUser.user_login === user_info.value.login || chatUser.role === 'OWNER' || myChatUser.role === 'MEMBER') return
  participant.value = chatUser
  setAdminOptions()
  isOpened.value = true
}

const closePopup = () => {
  isOpened.value = false
}

const setUser = () => {
  
}

const exitChat = () => {

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