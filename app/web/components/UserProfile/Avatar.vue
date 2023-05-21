<template>
    <div class="relative">
        <img class="rounded-full border-2 h-32 w-32 object-cover" :src="props.image" alt="logo" />
        <div v-if="props.isMe && !props.isProfile" @click="handleChangeImage"
            class="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 hover:opacity-50">
            <img class="absolute inset-0 w-full h-full object-cover rounded-full"
                src="https://icon-library.com/images/change-an-icon/change-an-icon-14.jpg" alt="hover image" />
        </div>
        <div v-if="updatePhoto" class="relative">
            <div class="absolute right-7 bg-white rounded-lg shadow-lg" style="width: 15rem">
                <div class="grid grid-cols-5 gap-4 p-4">
                    <div v-for="(image, index) in defaultImages" :key="index">
                        <img class="w-20 h-10 object-cover rounded-lg" :src="image" @click="updateAvatar(image)"
                            alt="icon" />
                    </div>
                </div>
            </div>
        </div>
        <UserProfileStatus v-if="!isMe || isProfile" :status="props.status" class="absolute bottom-2 right-2 w-6 h-6" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    isMe: {
        type: Boolean,
        default: false,
    },
    isProfile: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
})

const { setUserAvatar } = useUserInfo()

const updatePhoto = ref(false)

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

const handleChangeImage = () => {
    updatePhoto.value = !updatePhoto.value
}

const updateAvatar = async (image: string) => {
    updatePhoto.value = !updatePhoto.value
    setUserAvatar(image)
    await useUpdateUserInfo()
    window.location.reload()
}


</script>

