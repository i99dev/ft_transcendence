<template>
    <MainPopup :show="props?.show" @closeMainPopup="closePopup()">
        <form class="chat-form" @submit.prevent="">
            <DialogTitle
                v-if="props?.title"
                as="h3"
                class="text-lg font-medium leading-6 text-white"
            >
                {{ props?.title }}
            </DialogTitle>
            <div class="flex items-center border-b border-secondary py-2">
                <div class="file-upload">
                    <input
                        id="groupChatImage"
                        type="file"
                        ref="fileInput"
                        @change="handleFileUpload"
                        style="display: none"
                    />
                    <button
                        @click="fileInput.click()"
                        type="button"
                        class="border-1 border-white smooth-transition hover:bg-primary rounded-full focus:outline-white"
                        :class="{ 'p-2': !chatImage }"
                    >
                        <svg
                            v-if="!chatImage"
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
                        <img v-else :src="chatImage" class="rounded-full w-10 h-8 object-cover" />
                    </button>
                </div>

                <input
                    class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                    id="groupChatName"
                    type="text"
                    :placeholder="props?.name"
                    aria-label="Group Name"
                    v-model="chatName"
                    @keyup.enter="sendChatData"
                    required
                />
            </div>
            <div class="flex justify-end mt-4">
                <button
                    v-if="props.cancelButton"
                    class="flex-shrink-0 border-transparent border-4 text-white hover:text-primary text-sm py-1 px-2 rounded capitalize focus:outline-white"
                    type="button"
                    @click="closePopup('cancel')"
                >
                    {{ props.cancelButton || 'cancel' }}
                </button>
                <button
                    class="flex-shrink-0 bg-secondary hover:bg-primary smooth-transition border-white hover:border-white text-white py-1 px-2 rounded capitalize focus:outline-secondary hover:focus:outline-primary"
                    type="button"
                    @click="sendChatData"
                >
                    {{ props.submitButton || 'done' }}
                </button>
            </div>
        </form>
    </MainPopup>
</template>

<script lang="ts" setup>
const props = defineProps(['show', 'submitButton', 'cancelButton', 'name', 'image', 'title'])
const emit = defineEmits(['chatData', 'closePopup', 'cancel'])

const chatImage = ref(undefined as string | undefined)
const chatName = ref('')
const fileInput = ref()
const formData = ref(undefined as FormData | undefined)
const reader = ref(undefined as FileReader | undefined)

watch(
    () => props.show,
    () => {
        if (props.show) {
            if (props.image) chatImage.value = props.image
        }
    },
)

onUnmounted(() => {
    reset()
})

const reset = () => {
    chatImage.value = undefined
    fileInput.value = undefined
    formData.value = undefined
    chatName.value = ''
}

const handleFileUpload = async () => {
    const file = fileInput.value?.files[0]
    formData.value = new FormData()
    formData.value?.append('file', file)

    // Read the file as a data URL
    reader.value = new FileReader()
    reader.value?.readAsDataURL(file)

    // Set the image data property to the data URL
    reader.value.onload = () => {
        chatImage.value = reader.value?.result as string | undefined
    }
}

const sendChatData = () => {
    emit('chatData', {
        name: chatName.value,
        image: formData.value,
    })
    reset()
}

const closePopup = (action: 'chatData' | 'closePopup' | 'cancel' = 'closePopup') => {
    setTimeout(() => {
        reset()
    }, 200)
    emit(action)
}
</script>
