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
                @input="setSearchedGroupChats(searchedGroupChats)"
                class="text-sm leading-none text-left text-gray-600 px-4 py-2 w-full border rounded border-gray-300 focus:outline-indigo-400"
                type="text"
                ref="chatSearch"
                placeholder="Search"
                @focus-visible="!chatType"
            />
        </TransitionRoot>

        <button
            @click="handleChatSearch($event)"
            class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
            :class="{
                'bg-white': !searching,
                'text-indigo-400': !searching,
                'bg-indigo-400': searching,
                'text-white': searching,
            }"
        >
            <MagnifyingGlassIcon class="w-6 h-6 right-3 z-10 cursor-pointer" />
        </button>
        <button
            class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
            :class="{
                'bg-white': chatType !== 'GROUP',
                'text-indigo-400': chatType !== 'GROUP',
                'bg-indigo-400': chatType === 'GROUP',
                'text-white': chatType === 'GROUP',
            }"
            @click="switchChatType('GROUP')"
        >
            <UserGroupIcon class="h-6 w-6" />
        </button>
        <button
            class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mr-2 focus:outline-indigo-400"
            :class="{
                'bg-white': chatType !== 'DM',
                'text-indigo-400': chatType !== 'DM',
                'bg-indigo-400': chatType === 'DM',
                'text-white': chatType === 'DM',
            }"
            @click="switchChatType('DM')"
        >
            <UserIcon class="h-6 w-6" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { TransitionRoot } from '@headlessui/vue'
import { MagnifyingGlassIcon, UserIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const searchedGroupChats = ref('')
const searching = ref(false)
const chatSearch = ref()
const { chatType, setChatType } = useChatType()
const { setSearchedGroupChats } = useSearchedGroupChats()
const { setChatView } = useChatView()
const { setCurrentChat } = useCurrentChat()

const handleChatSearch = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    searching.value = true
    setChatType(null)
    setTimeout(() => {
        chatSearch.value.focus()
    }, 100)
}

const switchChatType = (type: ChatRoomType) => {
    searching.value = false
    setChatType(type)
    setChatView(true)
    setCurrentChat(null)
}
</script>
