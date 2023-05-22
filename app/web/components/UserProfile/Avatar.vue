<template>
    <div class="relative">
        <img v-if="isMe" class="rounded-full border-2 h-32 w-32 object-cover" :src="userInfo?.image || defaultImages[Math.floor(Math.random() * defaultImages.length)]" alt="logo" />
        <img v-else class="rounded-full border-2 h-32 w-32 object-cover" :src="props.Image || defaultImages[Math.floor(Math.random() * defaultImages.length)]" alt="logo" />
        <div v-if="props.isMe && !props.isProfile" @click="handleChangeImage"
            class="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 hover:opacity-50">
            <img class="absolute inset-0 w-full h-full object-cover rounded-full"
                src="https://icon-library.com/images/change-an-icon/change-an-icon-14.jpg" alt="hover image" />
        </div>
        <UserProfileStatus v-if="!isMe || isProfile" :status="props.status" class="absolute bottom-2 right-2 w-6 h-6" />
    </div>
</template>

<script setup lang="ts">

const userInfo = ref() as any

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

const updatePhoto = ref(false)

const handleChangeImage = () => {
    updatePhoto.value = !updatePhoto.value
}

onMounted(() => {
    const { user_info } = useUserInfo()
    userInfo.value = user_info.value
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

