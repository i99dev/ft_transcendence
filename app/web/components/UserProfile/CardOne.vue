<script setup>
const { user_info, setUserName, setUserAvatar } = useUserInfo()

const userData = computed(() => {
    return user_info.value
})
/**
 * edit username
 */
const editBoolaen = ref(true)
const updatePhoto = ref(false)
const editUsername = () => {
    editBoolaen.value = !editBoolaen.value
}
const updatePhotoBoolaen = () => {
    updatePhoto.value = !updatePhoto.value
}
const updateUsername = async () => {
    editBoolaen.value = !editBoolaen.value
    setUserName(userData.value.username)
    await useUpdateUserInfo()
}
/**
 * edit avatar
 */
const updateAvatar = async () => {
    updatePhoto.value = !updatePhoto.value
    setUserAvatar(userData.value.image)
    await useUpdateUserInfo()
}

const defaultImages = [
    'https://i1.ae/img/icons/1.png',
    'https://i1.ae/img/icons/2.png',
    'https://i1.ae/img/icons/3.png',
    'https://i1.ae/img/icons/4.png',
    'https://i1.ae/img/icons/5.png',
    'https://i1.ae/img/icons/6.png',
    'https://i1.ae/img/icons/7.png',
    'https://i1.ae/img/icons/15.png',
    'https://i1.ae/img/icons/8.png',
    'https://i1.ae/img/icons/9.png',
    'https://i1.ae/img/icons/10.png',
    'https://i1.ae/img/icons/11.png',
    'https://i1.ae/img/icons/12.png',
    'https://i1.ae/img/icons/13.png',
    'https://i1.ae/img/icons/14.png',
    'https://i1.ae/img/icons/16.png',
    'https://i1.ae/img/icons/17.png',
    'https://i1.ae/img/icons/18.png',
    'https://i1.ae/img/icons/19.png',
    'https://i1.ae/img/icons/20.png',
]
</script>

<template>
    <div>
        <div
            class="flex flex-row mobile:flex-col items-center shadow bg-white dark:bg-gray-800 space-y-4 p-6"
        >
            <img
                v-if="userData"
                class="rounded-full border-2 h-32 w-32 object-cover"
                :src="
                    userData?.image ||
                    defaultImages[Math.floor(Math.random() * defaultImages.length)]
                "
                alt="logo"
            />

            <div class="flex flex-col space-x-1 justify-center p-6">
                <p class="text-3xl text-black dark:text-white">Welcome</p>
                <!-- update username -->
                <div class="flex flex-row items-center w-full justify-between">
                    <div
                        class="text-2xl text-black dark:text-white px-2 w-32 h-8 overflow-hidden"
                        v-if="editBoolaen"
                    >
                        {{ userData?.username }}
                    </div>
                    <input
                        v-if="!editBoolaen"
                        :disabled="editBoolaen"
                        class="border-2 border-gray-300 rounded-md p-1 max-w-xs w-32 h-8"
                        type="text"
                        :value="userData?.username"
                        @input="userData.username = $event.target.value"
                    />
                    <!-- edit icon  -->
                    <div class="flex justify-center" @click="editUsername" v-if="editBoolaen">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    </div>
                    <!-- save -->
                    <div class="flex justify-center" @click="updateUsername" v-if="!editBoolaen">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 bg-green-300"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
