<template>
    <div>
        <TransitionRoot appear :show="props.isOpened" as="template">
            <Dialog as="div" @close="closePopup" class="relative z-10">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                            >
                                <!-- Popup content -->

                                <div class="w-full max-w-sm">
                                    <!-- Stage 1 -->
                                    <form
                                        class="chat-form"
                                        @submit.prevent=""
                                        v-if="stage === firstStage"
                                    >
                                        <DialogTitle
                                            as="h3"
                                            class="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Create Group
                                        </DialogTitle>
                                        <div
                                            class="flex items-center border-b border-indigo-500 py-2"
                                        >
                                            <div class="file-upload">
                                                <input
                                                    type="file"
                                                    ref="fileInput"
                                                    @change="handleFileUpload"
                                                    style="display: none"
                                                />
                                                <button
                                                    @click="() => fileInput.click()"
                                                    type="button"
                                                    class="bg-blue-100 rounded-full focus:outline-indigo-400"
                                                    :class="{ 'p-2': !chatImage }"
                                                >
                                                    <svg
                                                        v-if="!chatImage"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-camera-plus"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                        ></path>
                                                        <path
                                                            d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"
                                                        ></path>
                                                        <path d="M16 19h6"></path>
                                                        <path d="M19 16v6"></path>
                                                        <path
                                                            d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
                                                        ></path>
                                                    </svg>
                                                    <img
                                                        v-else
                                                        :src="chatImage"
                                                        class="rounded-full w-10 h-8 object-cover"
                                                    />
                                                    <!-- <div v-else >Nice</div> -->
                                                </button>
                                            </div>

                                            <input
                                                class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                                id="groupChatName"
                                                type="text"
                                                placeholder="Enter group name"
                                                aria-label="Group Name"
                                                v-model="groupChat.name"
                                                @keyup.enter="nextStage"
                                                required
                                            />
                                        </div>
                                        <div class="flex justify-end mt-4">
                                            <button
                                                class="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded capitalize focus:outline-indigo-400"
                                                type="button"
                                                @click="nextStage"
                                            >
                                                next
                                            </button>
                                        </div>
                                    </form>

                                    <!-- Stage 2 -->
                                    <form
                                        class="chat-form"
                                        @submit.prevent=""
                                        v-else-if="stage === 2"
                                    >
                                        <div
                                            v-for="user in users"
                                            class="flex-row inline-flex flex-nowrap"
                                        >
                                            <button
                                                class="border rounded-full bg-white ease-in-out transition duration-200 m-2 relative focus:outline-indigo-400"
                                                type="button"
                                                @click="removeUser(user)"
                                            >
                                                <img
                                                    class="rounded-full w-8 h-8 object-cover"
                                                    :src="user.image"
                                                    :alt="user.username"
                                                />
                                                <div
                                                    class="absolute -right-1 -bottom-1 rounded-full p-1 bg-slate-200"
                                                >
                                                    <XMarkIcon class="h-2 w-2" aria-hidden="true" />
                                                </div>
                                            </button>
                                        </div>
                                        <UserProfileList
                                            @selectUser="selectUser"
                                            :search="true"
                                            :unwanted-users="users"
                                        />
                                        <div class="flex justify-end mt-4">
                                            <button
                                                class="flex-shrink-0 border-transparent border-4 text-indigo-500 hover:text-indigo-800 text-sm py-1 px-2 rounded capitalize focus:outline-indigo-400"
                                                type="button"
                                                @click="prevStage"
                                            >
                                                back
                                            </button>
                                            <button
                                                class="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded capitalize focus:outline-indigo-400"
                                                type="button"
                                                @click="nextStage"
                                            >
                                                next
                                            </button>
                                        </div>
                                    </form>

                                    <!-- Stage 3 -->
                                    <form
                                        class="chat-form"
                                        @submit.prevent=""
                                        v-else-if="stage === lastStage"
                                    >
                                        <RadioGroup v-model="groupChat.chatType">
                                            <RadioGroupLabel class="sr-only"
                                                >Server size</RadioGroupLabel
                                            >
                                            <div class="space-y-2">
                                                <RadioGroupOption
                                                    as="template"
                                                    v-for="chatType in chatTypes"
                                                    :key="chatType.type"
                                                    :value="chatType"
                                                    v-slot="{ active, checked }"
                                                >
                                                    <div
                                                        :class="[
                                                            active
                                                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                                                : '',
                                                            checked
                                                                ? 'bg-indigo-600 bg-opacity-75 text-white '
                                                                : 'bg-white ',
                                                        ]"
                                                        class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
                                                    >
                                                        <div
                                                            class="flex w-full items-center justify-between"
                                                        >
                                                            <div class="flex items-center">
                                                                <div class="text-sm">
                                                                    <RadioGroupLabel
                                                                        as="p"
                                                                        :class="
                                                                            checked
                                                                                ? 'text-white'
                                                                                : 'text-gray-900'
                                                                        "
                                                                        class="font-medium"
                                                                    >
                                                                        {{ chatType.type }}
                                                                    </RadioGroupLabel>
                                                                    <RadioGroupDescription
                                                                        as="span"
                                                                        :class="
                                                                            checked
                                                                                ? 'text-sky-100'
                                                                                : 'text-gray-500'
                                                                        "
                                                                        class="inline"
                                                                    >
                                                                        <div
                                                                            v-if="
                                                                                chatType.type ===
                                                                                'PUBLIC'
                                                                            "
                                                                            class="flex flex-col md:mr-16 my-2"
                                                                        >
                                                                            <label
                                                                                for="createGroupPassword"
                                                                                class="text-sm font-bold leading-tight tracking-normal mb-2"
                                                                                :class="
                                                                                    checked
                                                                                        ? 'text-gray-200'
                                                                                        : 'text-gray-500'
                                                                                "
                                                                            >
                                                                                Password -
                                                                                <i>Optional</i>
                                                                            </label>
                                                                            <div class="relative">
                                                                                <div
                                                                                    @click="
                                                                                        changeView
                                                                                    "
                                                                                    class="absolute right-0 text-gray-600 dark:text-gray-400 hover:text-gray-700 flex items-center pr-3 h-full cursor-pointer"
                                                                                >
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        class="icon icon-tabler icon-tabler-eye"
                                                                                        width="20"
                                                                                        height="20"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke-width="1.5"
                                                                                        stroke="currentColor"
                                                                                        fill="none"
                                                                                        stroke-linecap="round"
                                                                                        stroke-linejoin="round"
                                                                                    >
                                                                                        <path
                                                                                            stroke="none"
                                                                                            d="M0 0h24v24H0z"
                                                                                        />
                                                                                        <circle
                                                                                            cx="12"
                                                                                            cy="12"
                                                                                            r="2"
                                                                                        />
                                                                                        <path
                                                                                            d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2"
                                                                                        />
                                                                                        <path
                                                                                            d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2"
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                                <input
                                                                                    class="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:bg-gray-800 bg-white dark:border-gray-700 font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                                                                                    id="createGroupPassword"
                                                                                    type="password"
                                                                                    v-model="
                                                                                        groupChat.password
                                                                                    "
                                                                                    placeholder="Enter password"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </RadioGroupDescription>
                                                                </div>
                                                            </div>
                                                            <div
                                                                v-show="checked"
                                                                class="shrink-0 text-white"
                                                            >
                                                                <svg
                                                                    class="h-6 w-6"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <circle
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="12"
                                                                        fill="#fff"
                                                                        fill-opacity="0.2"
                                                                    />
                                                                    <path
                                                                        d="M7 13l3 3 7-7"
                                                                        stroke="#fff"
                                                                        stroke-width="1.5"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RadioGroupOption>
                                            </div>
                                        </RadioGroup>
                                        <div class="flex justify-end mt-4">
                                            <button
                                                class="flex-shrink-0 border-transparent border-4 text-indigo-500 hover:text-indigo-800 text-sm py-1 px-2 rounded capitalize focus:outline-indigo-400"
                                                type="button"
                                                @click="prevStage"
                                            >
                                                back
                                            </button>
                                            <button
                                                class="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded capitalize focus:outline-indigo-400"
                                                type="button"
                                                @click="createGroupChat"
                                            >
                                                create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script lang="ts" setup>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupDescription,
    RadioGroupOption,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { chatSocket } = useChatSocket()
watch(chatSocket, async () => {
    socketOn()
})
const { user_info } = useUserInfo()
const { chats } = useChats()
const users = ref([] as UserGetDto[])
const stage = ref(1)
const chatImage = ref(null as any)
const fileInput = ref()
const formData = ref(new FormData())
const firstStage = 1
const lastStage = 3
const chatTypes = [
    {
        type: 'PUBLIC',
    },
    {
        type: 'PRIVATE',
    },
]
const groupChat = ref({
    name: '',
    image: '',
    chatType: chatTypes[0],
    password: '',
})

onMounted(() => {
    socketOn()
})

const socketOn = () => {
    chatSocket.value?.on('create-group-chat', async payload => {
        for (let i = 0; i < users.value.length; i++) {
            chatSocket.value?.emit(
                'user-group-chat',
                JSON.stringify({
                    room_id: payload.room_id,
                    user_login: users.value[i].login,
                    action: 'add',
                }),
            )
        }
        closePopup()

        const { data, error } = await useUplaod(payload.room_id, formData.value)
        if (!data.value)
            chats.value.forEach((chat: GroupChat) => {
                if (chat.chat_room_id === payload.room_id) chat.image = data.value.file_url
            })
    })
}

watch(
    () => props.isOpened,
    () => {
        setTimeout(() => document.getElementById('groupChatName')?.focus(), 200)
    },
)

const changeView = () => {
    let input = document.getElementById('createGroupPassword') as HTMLInputElement
    input.type = input.type === 'text' ? 'password' : 'text'
}

const props = defineProps(['isOpened'])
const emit = defineEmits(['closeGroupChatCreation'])

const selectUser = (user: UserGetDto) => {
    if (!users.value.find(u => u.id === user.id) && user.login !== user_info.value.login)
        users.value.push(user)
}

const removeUser = (user: UserGetDto) => {
    users.value = users.value.filter(u => u.id !== user.id)
}

const nextStage = () => {
    const formElement = document.getElementsByClassName(
        'chat-form',
    ) as HTMLCollectionOf<HTMLFormElement>
    console.log(formElement[stage.value - 1])
    if (
        stage.value !== 3 &&
        (!formElement[stage.value - 1] || formElement[stage.value - 1].reportValidity())
    ) {
        stage.value++
    }
}

const prevStage = () => {
    if (stage.value !== 1) stage.value--
}

const closePopup = () => {
    setTimeout(() => {
        groupChat.value = {
            name: '',
            image: 'https://picsum.photos/200',
            chatType: chatTypes[0],
            password: '',
        }
        chatImage.value = null
        users.value = []
        stage.value = 1
    }, 200)
    emit('closeGroupChatCreation')
}

const createGroupChat = () => {
    chatSocket.value?.emit(
        'create-group-chat',
        JSON.stringify({
            name: groupChat.value.name,
            image: groupChat.value.image,
            type:
                groupChat.value.chatType.type === 'PRIVATE'
                    ? 'PRIVATE'
                    : groupChat.value.password
                    ? 'PROTECTED'
                    : 'PUBLIC',
            password: groupChat.value.password,
        }),
    )
}

const handleForm = () => {}

const handleFileUpload = async () => {
    const file = fileInput.value.files[0]
    formData.value.append('file', file)

    const reader = new FileReader()

    // Read the file as a data URL
    reader.readAsDataURL(file)

    // Set the image data property to the data URL
    reader.onload = () => {
        chatImage.value = reader.result
    }
}
</script>
