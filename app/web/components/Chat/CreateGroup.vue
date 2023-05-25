<template>
    <div>
        <ChatImageAndName
            :show="props.isOpened && stage === 1"
            :submitButton="'next'"
            @chatData="setImageAndName"
            @closePopup="closePopup"
        />

        <ChatUsers
            :show="props.isOpened && stage === 2"
            :addButton="'next'"
            :cancelButton="'back'"
            @usersList="setNewUsers"
            @closePopup="closePopup"
            @cancel="prevStage"
        />

        <ChatType
            :show="props.isOpened && stage === 3"
            :submitButton="'create'"
            :cancelButton="'back'"
            @chatType="setType"
            @closePopup="closePopup"
            @cancel="prevStage"
        />
    </div>
</template>

<script lang="ts" setup>
const { chatSocket } = useChatSocket()
watch(chatSocket, async () => {
    socketOn()
})
const { chats } = useChats()
const users = ref([] as UserGetDto[])
const stage = ref(1)
const formData = ref(undefined as FormData | undefined)
const groupChat = ref(
    {} as {
        name: string
        image: string
        type: string
        password: string
    },
)

onMounted(() => {
    socketOn()
})

onUnmounted(() => {
    reset()
})

const reset = () => {
    users.value = []
    stage.value = 1
    formData.value = undefined
    groupChat.value = {} as {
        name: string
        image: string
        type: string
        password: string
    }
}

const socketOn = () => {
    chatSocket.value?.on('create-group-chat', async payload => {
        for (let i = 0; i < users.value?.length; i++) {
            chatSocket.value?.emit(
                'user-group-chat',
                JSON.stringify({
                    room_id: payload.room_id,
                    user_login: users.value[i].login,
                    action: 'add',
                }),
            )
        }
        if (formData.value) {
            const { data } = await useUplaod(payload.room_id, formData.value)
            if (data.value)
                chats.value?.forEach((chat: GroupChat) => {
                    if (chat.chat_room_id === payload.room_id) chat.image = data.value?.file_url
                })
        }
        closePopup()
    })
}

watch(
    () => props.isOpened,
    () => {
        setTimeout(() => document.getElementById('groupChatName')?.focus(), 200)
    },
)

const props = defineProps(['isOpened'])
const emit = defineEmits(['closeGroupChatCreation'])

const setNewUsers = (newUsers: UserGetDto[]) => {
    users.value = newUsers
    nextStage()
}

const setImageAndName = (data: { name: string; image: FormData }) => {
    groupChat.value.name = data?.name
    if (data?.image) formData.value = data?.image

    nextStage()
}

const setType = (data: { type: string; password: string }) => {
    groupChat.value.type = data.type
    if (data.type === 'PROTECTED') groupChat.value.password = data.password

    createGroupChat()
}

const nextStage = () => {
    const formElement = document.getElementsByClassName(
        'chat-form',
    ) as HTMLCollectionOf<HTMLFormElement>
    if (
        stage.value !== 3 &&
        (!formElement[stage.value - 1] || formElement[stage.value - 1].reportValidity())
    )
        stage.value++
}

const prevStage = () => {
    if (stage.value !== 1) stage.value--
}

const closePopup = () => {
    setTimeout(() => {
        reset()
    }, 200)
    emit('closeGroupChatCreation')
}

const createGroupChat = () => {
    chatSocket.value?.emit('create-group-chat', JSON.stringify(groupChat.value))
}
</script>
