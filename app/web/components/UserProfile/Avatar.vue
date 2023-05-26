<template>
    <div class="relative">
        <img
            v-if="isMe"
            class="rounded-full border-2 h-32 w-32 object-cover"
            :src="
                user_info?.image || defaultImages[Math.floor(Math.random() * defaultImages.length)]
            "
            alt="logo"
        />
        <img
            v-else
            class="rounded-full border-2 h-32 w-32 object-cover"
            :src="props.Image || defaultImages[Math.floor(Math.random() * defaultImages.length)]"
            alt="logo"
        />
        <UserProfileStatus
            v-if="!isMe || isProfile"
            :status="props.status"
            class="absolute bottom-2 right-2 w-6 h-6"
        />
    </div>
</template>

<script setup lang="ts">
const { user_info } = useUserInfo()

const props = defineProps({
    isMe: {
        type: Boolean,
        default: false,
    },
    isProfile: {
        type: Boolean,
        default: false,
    },
    Image: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
})

const defaultImages = [
    'https://i1.ae/img/icons/1.png',
    'https://i1.ae/img/icons/2.png',
    'https://i1.ae/img/icons/3.png',
    'https://i1.ae/img/icons/4.png',
    'https://i1.ae/img/icons/5.png',
    'https://i1.ae/img/icons/6.png',
    'https://i1.ae/img/icons/7.png',
    'https://i1.ae/img/icons/8.png',
    'https://i1.ae/img/icons/9.png',
    'https://i1.ae/img/icons/10.png',
    'https://i1.ae/img/icons/11.png',
    'https://i1.ae/img/icons/12.png',
    'https://i1.ae/img/icons/13.png',
    'https://i1.ae/img/icons/14.png',
    'https://i1.ae/img/icons/20.png',
]
</script>
