<template>
    <TransitionRoot as="template">
        <Dialog as="div" class="fixed inset-0 z-20 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" @click="addFriendOpen = false">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Add Friend</h3>
                  <div class="mt-2">
                    <input v-model="friendNameToAdd" type="text" placeholder="Enter friend's name" class="w-full px-3 py-2 text-sm leading-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button @click="addNewFriend" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Add
                  </button>
                  <button @click="$emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
</template>

<script setup lang='ts'>
import { useFriends } from '~~/composables/Friends/useFriends';
import {
    Dialog,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'

const  { addFriend } = await useFriends()
const friendNameToAdd = ref("");
const addFriendOpen = ref(true)
const emit = defineEmits(['close'])

function addNewFriend() {
  console.log("Add friend:", friendNameToAdd.value);
  addFriend(friendNameToAdd.value)
  // Add logic to add the friend
  emit('close')
}

</script>