<template>
    <div
        v-if="show"
        class="bg-z m-2 border h-fit border-white text-white text-sm rounded-2xl p-1 shadow-md font-bold"
    >
        <div class="centered">
            <div class="px-2 mobile:text-xs">
                <span class="">{{ props.notification?.content }}</span>
            </div>
            <div class="ml-auto">
                <div v-if="props.notification?.type === 'FRIEND_REQUEST'">
                    <button
                        @click="accept"
                        class="bg-primary hover:scale-105 smooth-transition py-1 px-2 rounded-full m-2 capitalize"
                    >
                        accept
                    </button>
                    <button
                        v-if="props.notification?.type === 'FRIEND_REQUEST'"
                        @click="decline"
                        class="bg-secondary hover:scale-105 smooth-transition py-1 px-2 rounded-full m-2 capitalize"
                    >
                        decline
                    </button>
                </div>
                <button
                    v-if="props.notification?.type === 'FRIEND_REQUEST_ACCEPTED'"
                    @click="close"
                    class="text-white hover:bg-primary rounded-full p-1 mr-1 smooth-transition focus:ring-2 focus:ring-primary"
                >
                    <span class="sr-only">Close notification</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useFriends } from '../../composables/useFriends'
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
