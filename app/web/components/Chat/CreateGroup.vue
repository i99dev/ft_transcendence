<template>
  <div>
    <TransitionRoot appear :show="isOpen" as="template">
          <Dialog as="div" @close="$emit('closeGroupChatCreation')" class="relative z-10">
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
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create Group
                    </DialogTitle>
                    
                    <!-- Popup content -->

                    <form class="w-full max-w-sm">
                      <div class="flex items-center border-b border-indigo-500 py-2">
                        <button class="bg-blue-100 p-2 rounded-full" type="button">
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-camera-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"></path>
                            <path d="M16 19h6"></path>
                            <path d="M19 16v6"></path>
                            <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                          </svg>
                        </button>
                        <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
                          type="text"
                          placeholder="Enter group name"
                          aria-label="Group Name"
                          required
                        >
                        
                      </div>

                      <!-- users -->
                      <div class="">
                        <div v-for="user in users"
                          class=" flex-row inline-flex flex-nowrap">
                          <button class="border rounded-full bg-white ease-in-out transition duration-200 m-2 relative"
                            @click="removeUser(user)"
                          >
                            <img class="rounded-full w-8 h-8 object-cover"
                              :src="user.image"
                              :alt="user.username"
                            >
                            <div class="absolute -right-1 -bottom-1 rounded-full p-1 bg-slate-200">
                              <XMarkIcon class="h-2 w-2" aria-hidden="true" />
                            </div>
                          </button>
                        </div>
                      </div>
                      <UserProfileList @selectUser="selectUser" />

                      <div class="flex justify-end mt-4">
                        <button class="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                          Create
                        </button>
                        <button class="flex-shrink-0 border-transparent border-4 text-indigo-500 hover:text-indigo-800 text-sm py-1 px-2 rounded"
                          type="button"
                          @click="$emit('closeGroupChatCreation')"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
  </div>
</template>

<script lang="ts" setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const {isOpen} = defineProps(['isOpen'])
const users = ref([] as UserGetDto[])

const selectUser = (user: UserGetDto) => {
  if (!users.value.find((u) => u.id === user.id))
    users.value.push(user)
}

const removeUser = (user: UserGetDto) => {
  users.value = users.value.filter((u) => u.id !== user.id)
}

</script>
