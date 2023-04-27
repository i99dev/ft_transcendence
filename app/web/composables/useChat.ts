export const useChat = () => {
    const chat_info = useState<any | null>('chat_info', () => {
        return {
            chatModalOpen: false,
            messages: [],
            newMessage: '',
        }
    })

    const setChatModalOpen = (status: boolean) => {
        chat_info.value.chatModalOpen = status
    }

    const send_message = async (message: string) => {
        chat_info.value.messages.push({
            message,
            user: 'me',
        })
        chat_info.value.newMessage = ''
    }

    return { chat_info, setChatModalOpen, send_message }
}


export async function useDirectChats(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('chats/directChat/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useGroupChats(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('chats/groupChat/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useGetGroupChatParticipants(room_id: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch(`chats/${room_id}/users`, {
        baseURL: useRuntimeConfig().API_URL,
        query: { type: 'GROUP'},
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useGroupChatSearch(name: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('chats/groupChat/search', {
        baseURL: useRuntimeConfig().API_URL,
        query: {
          name: name
        },
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useChatMessages(room_id: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch(`chats/${room_id}/messages`, {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export const useChatType = () => {
    const chatType = useState<ChatRoomType | null>('chat_type', () => 'DM')

    const setChatType = async (type: ChatRoomType | null) => {
        const { setChats } = useChats()
        const { data } = type === 'DM' ? await useDirectChats() : type === 'GROUP'? await useGroupChats() : await useGroupChatSearch('')
        if (data) setChats(data.value)

        chatType.value = type
    }

    setChatType(chatType.value)

    return { chatType, setChatType }
}

export const useChats = () => {
    const chats = useState<any | null>('chats', () => null)
    const searchedGroupChats = useState<GroupChat[] & DirectChat[] | null>('SearchedGroupChats', () => null)

    const setChats = (chatList: GroupChat[] & DirectChat[] | null) => {
        chats.value = chatList
    }

    const setSearchedGroupChats = async (name: string) => {
        const {data} = await useGroupChatSearch(name)
        setChats(data.value)
    }

    return { chats, searchedGroupChats, setSearchedGroupChats, setChats }
}

export const useSearchedGroupChats = () => {
    const searchedGroupChats = useState<GroupChat & DirectChat | null>('SearchedGroupChats', () => null)

    const setSearchedGroupChats = async (name: string) => {
        const { setChats } = useChats()
        const {data} = await useGroupChatSearch(name)
        setChats(data.value)
    }

    return { searchedGroupChats, setSearchedGroupChats }
}

export const useCurrentChat = () => {
    const currentChat = useState<GroupChat & DirectChat | null>('current_chat', () => null)

    const setCurrentChat = (chat: GroupChat & DirectChat | null) => {
        currentChat.value = chat
    }

    return { currentChat, setCurrentChat }
}

export const useGroupChatParticipants = () => {
    const participants = useState<ChatUser[] | null>('group_chat_participants', () => null)

    const setParticipants = (groupChatParticipants: ChatUser[] | null) => {
        participants.value = groupChatParticipants
    }

    const updateParticipants = async () => {
        const { currentChat } = useCurrentChat()
        if (currentChat.value) {
            const {data: chatUsers} = await useGetGroupChatParticipants(currentChat.value.chat_room_id)
            if (chatUsers)
            setParticipants(chatUsers.value.chat_user)
        }
    }

    return { participants, setParticipants, updateParticipants }
}

export const useChatView = () => {
    const chatView = useState<boolean>('chat_view', () => true)

    const setChatView = (view: boolean) => {
        chatView.value = view
    }

    return { chatView, setChatView }
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
