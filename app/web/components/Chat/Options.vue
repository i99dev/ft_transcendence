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
                class="text-sm leading-none text-left text-white bg-background_light px-4 py-3 w-full border rounded border-tertiary_light outline-none"
                type="text"
                ref="chatSearch"
                placeholder="Search"
                @focus-visible="!chatType"
            />
        </TransitionRoot>

        <button
            @click="handleChatSearch($event)"
            class="border rounded-full hover:bg-primary ease-in-out transition duration-200 p-2 mr-2 focus:outline-primary text-white"
            :class="{
                'bg-background_light opacity-70': !searching,
                'bg-primary': searching,
            }"
        >
            <MagnifyingGlassIcon class="w-6 h-6 right-3 z-10 cursor-pointer" />
        </button>
        <button
            class="border rounded-full hover:bg-primary ease-in-out transition duration-200 p-2 mr-2 focus:outline-primary text-white"
            :class="{
                'bg-background_light opacity-70': chatType !== 'GROUP',
                'bg-primary': chatType === 'GROUP',
            }"
            @click="switchChatType('GROUP')"
        >
            <UserGroupIcon class="h-6 w-6" />
        </button>
        <button
            class="border rounded-full hover:bg-primary ease-in-out transition duration-200 p-2 mr-2 focus:outline-primary text-white"
            :class="{
                'bg-background_light opacity-70': chatType !== 'DM',
                'bg-primary': chatType === 'DM',
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
        chatSearch.value?.focus()
    }, 100)
}

const switchChatType = (type: ChatRoomType) => {
    searching.value = false
    setChatType(type)
}
</script>
