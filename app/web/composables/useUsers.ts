export async function useUsers(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('users', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useUsersSearch(username: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('users/search', {
        baseURL: useRuntimeConfig().API_URL,
        query: {
            username: username,
        },
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function SearchUserNames(username: string): Promise<any[] | null> {
    const { data, error: errorRef } = await useFetch<any[]>(`users/search/${username}`, {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return data.value
}

export async function getUserInfo(player: string): Promise<any> {
    const { data, error: errorRef } = await useFetch<any>(`/users/${player}`, {
        method: 'GET',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return data.value
}

export async function getUserbyUserName(player: string): Promise<any> {
    const { data, error: errorRef } = await useFetch<number>(`/users/username/${player}`, {
        method: 'GET',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return data.value
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
