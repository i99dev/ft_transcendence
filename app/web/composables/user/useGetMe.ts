export async function useGetMe(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('users/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
        lazy: true,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

interface UserInfo {
    id: number
    login: string
    username: string
    email: string
    image: string
}

export const useUserInfo = (data: UserInfo) =>
    useState<UserInfo | null>('userInfo', () => {
        return data
    })

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
