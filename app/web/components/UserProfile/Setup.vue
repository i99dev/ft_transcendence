<template>
    <div>
        <MainPopup :show="props?.show" @closeMainPopup="closePopup()">
            <form class="chat-form" @submit.prevent="">
                <div class="flex items-center">
                    <div class="file-upload">
                        <input
                            id="groupChatImage"
                            type="file"
                            ref="fileInput"
                            @change="uploadeImage"
                            style="display: none"
                        />
                        <div
                            class="border-1 border-white smooth-transition hover:bg-primary rounded-full focus:outline-white"
                            :class="{ 'p-2': !image }"
                        >
                            <svg
                                v-if="!image"
                                xmlns="http://www.w3.org/2000/svg"
                                class="stroke-2 stroke-white fill-none"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"
                                ></path>
                                <path d="M16 19h6"></path>
                                <path d="M19 16v6"></path>
                                <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                            </svg>
                            <img
                                v-else
                                :src="image"
                                class="rounded-full w-16 aspect-square object-cover"
                            />
                        </div>
                    </div>

                    <div class="border-b border-secondary py-2 mx-5">
                        <input
                            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                            id="groupChatName"
                            type="text"
                            :placeholder="user_info?.username"
                            aria-label="Group Name"
                            v-model="newUsername"
                            @keyup.enter="submitProfile()"
                            required
                        />
                    </div>
                </div>
                <div class="centered my-5">
                    <button
                        class="mx-4 flex-shrink-0 bg-secondary hover:bg-primary smooth-transition border-white hover:border-white text-white py-1 px-2 rounded capitalize focus:outline-secondary hover:focus:outline-primary"
                        type="button"
                        @click=" fileInput.click()"
                    >
                        upload
                    </button>
                </div>
                <div>
                    <Disclosure v-slot="{ open }">
                        <div class="w-full centered">
                            <DisclosureButton
                                class="flex w-1/2 justify-between border-b border-white px-4 py-2 text-left text-sm font-medium text-white rounded-t-xl smooth-transition hover:bg-primary focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 capitalize"
                            >
                                <span class="justify-self-center">custom</span>
                                <ChevronDownIcon
                                    :class="open ? 'rotate-180 transform' : ''"
                                    class="h-5 w-5 smooth-transition"
                                />
                            </DisclosureButton>
                        </div>
                        <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div class="grid grid-cols-4 gap-4 p-4">
                                <button
                                    v-for="(image, index) in defaultImages"
                                    :key="index"
                                    type="button"
                                    class="rounded-full hover:bg-background_light hover:border smooth-transition"
                                >
                                    <img
                                        class="w-full aspect-square items-center justify-center object-cover rounded-full hover:shadow-lg"
                                        :src="image"
                                        @click="
                                            () => {
                                                useDefaultImage(image)
                                            }
                                        "
                                        alt="icon"
                                    />
                                </button>
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                </div>
                <div class="flex justify-end mt-4">
                    <button
                        class="flex-shrink-0 bg-secondary hover:bg-primary smooth-transition border-white hover:border-white text-white py-1 px-2 rounded capitalize focus:outline-secondary hover:focus:outline-primary"
                        type="button"
                        @click="
                            () => {
                                submitProfile()
                            }
                        "
                    >
                        {{ props.submitButton || 'done' }}
                    </button>
                </div>
            </form>
        </MainPopup>
    </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useToast } from 'primevue/usetoast'

const props = defineProps(['show', 'submitButton'])
const emit = defineEmits(['closePopup'])

const { user_info, setUserName, setUserAvatar } = useUserInfo()

const newUsername = ref('')

const toast = useToast()

const image = ref(user_info.value?.image.slice())

const formData = ref(undefined as FormData | undefined)

const reader = ref(new FileReader())

const fileInput = ref()

const reset = () => {
    newUsername.value = ''
    image.value = user_info.value?.image.slice()
    formData.value = undefined
    reader.value = new FileReader()
}

const closePopup = () => {
    reset()
    emit('closePopup')
}

const uploadeImage = async () => {
    const file = fileInput.value.files[0]
    if (!file) return

    formData.value = new FormData()
    formData.value?.append('file', file)

    reader.value?.readAsDataURL(file)

    reader.value.onload = () => {
        image.value = reader.value?.result
    }
}

const useDefaultImage = (userImage: string) => {
    image.value = userImage
    formData.value = undefined
    reader.value = new FileReader()
}

const submitProfile = async () => {
    await updateUsername()
    await uploadUserImage()
    await updateUserImage()
    closePopup()
}

const updateUsername = async () => {
    if (newUsername?.value) {
        const { data } = await useUpdateUserInfo({ username: newUsername?.value } as UserGetDto)
        if (data.value) setUserName(newUsername?.value)
        else {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: 'Invalid username',
                life: 3000,
            })
            return false
        }
    }
    return true
}

const uploadUserImage = async () => {
    if (formData.value) {
        const { data } = await useUplaod(user_info.value?.login, formData.value)
        if (data.value) image.value = data.value?.file_url
        else {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: 'Invalid image',
                life: 3000,
            })
            return false
        }
    }
    return true
}

const updateUserImage = async () => {
    if (image.value !== user_info.value?.image) {
        const { data } = await useUpdateUserInfo({ image: image.value } as UserGetDto)
        if (data.value) setUserAvatar(image.value)
        else {
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: "Can't update the image!!",
                life: 3000,
            })
            return false
        }
    }
    return true
}

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
    'https://icons.iconarchive.com/icons/crountch/one-piece-jolly-roger/256/Shanks-icon.png',
]
</script>
