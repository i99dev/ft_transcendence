<template>
    <div
        v-if="show"
        class="bg-white border-t-4 border-slate-900 text-slate-900 px-4 py-3 shadow-md relative"
    >
        <div class="flex items-center">
            <div class="py-1">
                <span class="font-bold">{{ props.notification?.content }}</span>
            </div>
            <div class="ml-auto flex items-center">
                <button
                    v-if="props.notification?.type === 'FRIEND_REQUEST'"
                    @click="accept"
                    class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-1 px-2 rounded mr-2"
                >
                    Accept
                </button>
                <button
                    v-if="props.notification?.type === 'FRIEND_REQUEST'"
                    @click="decline"
                    class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-2 rounded mr-2"
                >
                    Decline
                </button>
                <button
                    v-if="props.notification?.type === 'FRIEND_REQUEST_ACCEPTED'"
                    @click="close"
                    class="text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                >
                    <span class="sr-only">Close notification</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useFriends } from '~~/composables/Friends/useFriends'
const props = defineProps({
    notification: {
        type: Object,
        required: true,
    },
})

const { addFriend, removeFriend } = await useFriends()
const show = ref(true)
const emit = defineEmits(['close'])

const accept = () => {
    addFriend(props.notification?.target as string)
    emit('close')
    show.value = false
}

const decline = () => {
    removeFriend(props.notification?.target as string)
    emit('close')
    show.value = false
}

const close = () => {
    emit('close')
    show.value = false
}
</script>
