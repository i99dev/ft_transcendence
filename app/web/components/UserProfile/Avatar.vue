<template>
    <div class="relative">
        <img class="rounded-full border-2 h-32 w-32 object-cover" :src="props.image" alt="logo" />
        <div v-if="props.isMe && !props.isProfile" @click="handleChangeImage"
            class="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 hover:opacity-50">
            <img class="absolute inset-0 w-full h-full object-cover rounded-full"
                src="https://icon-library.com/images/change-an-icon/change-an-icon-14.jpg" alt="hover image" />
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

const updatePhoto = ref(false)


const handleChangeImage = () => {
    updatePhoto.value = !updatePhoto.value
}


</script>

