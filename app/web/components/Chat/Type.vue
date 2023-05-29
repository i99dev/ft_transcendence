<template>
    <MainPopup :show="props?.show" @closeMainPopup="closePopup()">
        <form class="chat-form" @submit.prevent="">
            <RadioGroup v-model="groupChatType">
                <RadioGroupLabel class="sr-only">Group Chat Type</RadioGroupLabel>
                <div class="space-y-2">
                    <RadioGroupOption
                        as="template"
                        v-for="chatType in chatTypes"
                        :key="chatType?.type"
                        :value="chatType"
                        v-slot="{ active, checked }"
                    >
                        <div
                            :class="[
                                active
                                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                    : '',
                                checked
                                    ? 'bg-primary bg-opacity-75 text-white '
                                    : 'bg-background_light ',
                            ]"
                            class="relative flex cursor-pointer border-1 border-white text-white rounded-lg px-5 py-4 shadow-md focus:outline-none"
                        >
                            <div class="flex w-full items-center justify-between">
                                <div class="flex items-center">
                                    <div class="text-sm">
                                        <RadioGroupLabel as="p" class="font-medium">
                                            {{ chatType.type }}
                                        </RadioGroupLabel>
                                        <RadioGroupDescription as="span" class="inline">
                                            <div
                                                v-if="chatType.type === 'PUBLIC'"
                                                class="flex flex-col md:mr-16 my-2"
                                            >
                                                <label
                                                    for="createGroupPassword"
                                                    class="text-sm font-bold leading-tight tracking-normal mb-2"
                                                    :class="checked ? 'opacity-100' : 'opacity-70'"
                                                >
                                                    Password -
                                                    <i>Optional</i>
                                                </label>
                                                <div class="relative">
                                                    <div
                                                        @click="changeView"
                                                        class="absolute right-0 text-white opacity-50 hover:opacity-100 flex items-center pr-3 h-full cursor-pointer"
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
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <circle cx="12" cy="12" r="2" />
                                                            <path
                                                                d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2"
                                                            />
                                                            <path
                                                                d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        class="text-white focus:outline-none focus:border focus:border-white bg-background_light font-normal w-64 h-10 flex items-center pl-3 text-sm border-white rounded border shadow"
                                                        id="createGroupPassword"
                                                        type="password"
                                                        v-model="chatPassword"
                                                        placeholder="Enter password"
                                                    />
                                                </div>
                                            </div>
                                        </RadioGroupDescription>
                                    </div>
                                </div>
                                <div v-show="checked" class="shrink-0 text-white">
                                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
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
                    v-if="props.cancelButton"
                    class="flex-shrink-0 border-transparent border-4 text-white hover:text-primary text-sm py-1 px-2 rounded capitalize focus:outline-white"
                    type="button"
                    @click="() => closePopup('cancel')"
                >
                    {{ props.cancelButton || 'cancel' }}
                </button>
                <button
                    class="flex-shrink-0 bg-secondary hover:bg-primary smooth-transition border-white hover:border-white text-white py-1 px-2 rounded capitalize focus:outline-secondary hover:focus:outline-primary"
                    type="button"
                    @click="sendChatType"
                >
                    {{ props.submitButton || 'done' }}
                </button>
            </div>
        </form>
    </MainPopup>
</template>

<script lang="ts" setup>
import {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupDescription,
    RadioGroupOption,
} from '@headlessui/vue'

const props = defineProps(['show', 'submitButton', 'cancelButton', 'type'])
const emit = defineEmits(['chatType', 'closePopup', 'cancel'])

const chatTypes = [
    {
        type: 'PUBLIC',
    },
    {
        type: 'PRIVATE',
    },
]
const groupChatType = ref(chatTypes[0] as { type: string } | undefined)
const chatPassword = ref('')

watch(
    () => props.show,
    () => {
        if (props.show) if (props?.type === 'PRIVATE') groupChatType.value = chatTypes[1]
    },
)

onUnmounted(() => {
    closePopup()
})

const reset = () => {
    groupChatType.value = chatTypes[0]
    chatPassword.value = ''
}

const sendChatType = () => {
    emit('chatType', {
        type:
            groupChatType.value?.type === 'PRIVATE'
                ? 'PRIVATE'
                : chatPassword.value
                ? 'PROTECTED'
                : 'PUBLIC',
        password: chatPassword.value,
    })
    closePopup()
}

const changeView = () => {
    let input = document.getElementById('createGroupPassword') as HTMLInputElement
    input.type = input.type === 'text' ? 'password' : 'text'
}

const closePopup = (action: 'chatType' | 'closePopup' | 'cancel' = 'closePopup') => {
    setTimeout(() => {
        reset()
    }, 200)
    emit(action)
}
</script>
