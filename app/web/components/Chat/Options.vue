<template>
    <div class="flex flex-row mb-2">
        <TransitionRoot
        :show="searching"
        enter="transition-opacity duration-500 ease-in-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-500 ease-in-out"
        leave-from="opacity-100"
        leave-to="opacity-0"
        class="w-4/5 mx-2 flex items-center"
    >
        <input
            v-model="searchedGroupChats"
            @input="$emit('filteredGroupChatNames', searchedGroupChats)"
            class="text-sm leading-none text-left text-gray-600 px-4 py-2 w-full border rounded border-gray-300 focus:outline-indigo-700"
            type="text"
            placeholder="Search"
        />
    </TransitionRoot>
    
    <button 
        @click="handleChatSearch()"
        class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
        :class="{'bg-white': !searching, 'text-indigo-400': !searching, 'bg-indigo-400': searching, 'text-white': searching}"
    >
        <MagnifyingGlassIcon class="w-6 h-6 right-3 z-10 cursor-pointer"/>
    </button>
    <button class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
        :class="{'bg-white': props.chatType !== 'GROUP', 'text-indigo-400': props.chatType !== 'GROUP', 'bg-indigo-400': props.chatType === 'GROUP', 'text-white': props.chatType === 'GROUP'}"
        @click="switchChatType('GROUP')">
        <UserGroupIcon class="h-6 w-6" />
    </button>
    <button class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
        :class="{'bg-white': props.chatType !== 'DM', 'text-indigo-400': props.chatType !== 'DM', 'bg-indigo-400': props.chatType === 'DM', 'text-white': props.chatType === 'DM'}"
        @click="switchChatType('DM')">
        <UserIcon class="h-6 w-6" />
    </button>
  </div>
</template>


<script lang="ts" setup>
import { TransitionRoot } from '@headlessui/vue'
import {
    MagnifyingGlassIcon,
    UserIcon,
    UserGroupIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps(['chatType'])
const searchedGroupChats = ref('')
const searching = ref(false)
const emit = defineEmits(['filteredGroupChatNames', 'switchChatType'])

const handleChatSearch = () => {
    searching.value = true
    emit('filteredGroupChatNames', searchedGroupChats)
    emit('switchChatType', '')
}

const switchChatType = (type: string) => {
    searching.value = false
    emit('switchChatType', type)
}

</script>
