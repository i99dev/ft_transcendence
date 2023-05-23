<template>
    <div>
        <div class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50">
            <div
                class="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div class="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
                    <div class="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                        <div class="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                            <!-- component -->
                       <div v-if="errCode != 0" class="flex bg-red-100 rounded-lg mb-4 z-50 text-sm text-red-700" role="alert">
                            <svg class="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <span class="font-medium">Error !</span> {{ errMsgs.get(errCode) }}
                            </div>
                        </div>
                            <h1 class="font-thinner flex text-4xl pt-10 px-5 py-10">
                                Setup Your Profile
                            </h1>

                            <form class="mx-5 my-4">
                                <label class="relative block p-3 border-2 border-black rounded" htmlFor="name">
                                    <span class="text-md font-semibold text-zinc-900" htmlFor="name">
                                        User Name
                                    </span>
                                    <input class="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                                        id="name" type="text" :placeholder="user_info?.username" v-model="newUsername" />
                                </label>
                                <div class="mt-10 px-20">
                                    <img class="h-20 w-20 object-cover rounded-full" :src="image"
                                        alt="Current profile photo" />
                                </div>
                                <div v-if="!isDefault && !isUploading" class="mt-4 text-xl text-center">
                                    <span> Select your preferred method for changing the Avatar upload new or use Default:
                                    </span>
                                    <div class="flex space-x-4">
                                        <a @click="isUploadingImage" href="#"
                                            class="h-10 mt-5 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">Upload</a>
                                        <a @click="isDefaultImage" href="#"
                                            class="h-10 mt-5 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">Default</a>
                                    </div>
                                </div>

                                <div v-if="isUploading" class="max-w-1xl pt-3 mx-auto">

                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file"
                                            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                                    </path>
                                                </svg>
                                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                        class="font-semibold">Click to upload</span></p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                            <input id="dropzone-file" type="file" accept="image/*" class="hidden"
                                                @change="uploadeImage" />
                                        </label>
                                    </div>

                                </div>

                                <div v-if="isDefault" class="grid grid-cols-4 gap-4 p-4">
                                    <div v-for="(image, index) in defaultImages" :key="index">
                                        <img class="w-25 h-15 items-center justify-center object-cover rounded-lg hover:shadow-lg"
                                            :src="image" @click="changeImage(image)" alt="icon" />
                                    </div>
                                </div>

                            </form>
                            <div v-if="isDefault || isUploading" class="flex space-x-4">
                                <a @click="backtoImageSelection" href="#"
                                    class="h-10 mb-2 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">Back</a>
                            </div>
                            <div>
                                <button @click="submitProfile()"
                                    class="h-10 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                    Ok
                                </button>
                                <button @click="emit('close')"
                                    class="h-10 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { user_info, setUserName, setUserAvatar } = useUserInfo()

const emit = defineEmits(['close'])

const newUsername = ref('')

const newAvatar = ref(null as any)

const image = ref(user_info.value?.image)

const formData = ref(new FormData())

const reader = ref(new FileReader())

const isUploading = ref(false)

const isDefault = ref(false)

const errCode = ref(0)

const uploadeImage = async (event: any) => {
    const file = event.target.files[0]
    if (!file) return

    formData.value?.append('file', file)

    reader.value?.readAsDataURL(file)

    reader.value.onload = () => {
        image.value = reader.value?.result
        newAvatar.value = image.value
        setUserAvatar(image.value)
    }
}

const changeImage = (i: string) => {
    newAvatar.value = i
    image.value = i
}

const isUploadingImage = () => {
    isDefault.value = isDefault.value ? !isDefault.value : isDefault.value
    isUploading.value = !isUploading.value
}

const isDefaultImage = () => {
    isUploading.value = isUploading.value ? !isUploading.value : isUploading.value
    isDefault.value = !isDefault.value
}

const backtoImageSelection = () => {
    isUploading.value = isUploading.value ? !isUploading.value : isUploading.value
    isDefault.value = isDefault.value ? !isDefault.value : isDefault.value
}

const submitProfile = async () => {
    if (newUsername?.value && newUsername?.value != '') {
        setUserName(newUsername.value)
        const { resStatus } = await useUpdateUserInfo()
        errCode.value = resStatus
    }
    if (newAvatar?.value && newAvatar?.value != '' && isUploading.value) {
        const { resStatus } = await useUplaod(user_info.value?.login, formData.value)
        setUserAvatar(newAvatar.value)
        errCode.value = resStatus
    }
    if (newAvatar?.value && newAvatar.value != '' && isDefault.value) {
        setUserAvatar(newAvatar.value)
        await useUpdateUserInfo()
        const { resStatus } = await useUpdateUserInfo()
        errCode.value = resStatus
    }
    if (errCode.value == 0)
        emit('close')
}

const errMsgs = computed(() => {
    const map = new Map();
    map.set(400, "Please choose a shorter name. The current name is too long.");
    map.set(415, "Please select a different image. The chosen file format is not supported.");
    map.set(500, "Please select a different username as it is already in use.");
    return map;
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
