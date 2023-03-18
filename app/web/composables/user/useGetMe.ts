export async function useGetMe(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useAsyncData('meUser', () => {
        return $fetch('users/me', {
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
            baseURL: useRuntimeConfig().API_URL,
        })
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

interface UserInfo {
    id: number
    login: string
    username: string
    email: string
    image: string
}

export const useUserInfo = () => {
    const user_info = useState<any | null>('user_info', () => {})

    const setUserInfo = (user: any) => {
        user_info.value = user
    }

    const clearUserInfo = () => {
        user_info.value = null
    }

    const setUserName = (name: string) => {
        user_info.value.username = name
    }

    return { user_info, setUserInfo, clearUserInfo, setUserName }
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
