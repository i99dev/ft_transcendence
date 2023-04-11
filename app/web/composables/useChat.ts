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

export async function useGroupChatParticipants(room_id: string): Promise<any> {
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

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
