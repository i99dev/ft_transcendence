// import { redirect } from "next/dist/server/api-utils"

import { NextApiResponse } from 'next'

export const useProfileAvatar = async () => {
    const { data, error } = await fetchUser()
    return data.value?.image
}

export const useNickName = () => useState<string>('Nickname', () => useAuth().value?.username)

export const useIsLogin = async () => {
    return useCookie('access_token').value
}

export const checkCookies = () => {
    const cookie = useCookie('access_token')
    console.log('Checking Cookies')
    if (cookie.value) {
        console.log('Yes Cookies !')
        return true
    } else {
        console.log('No Cookies :(')
        return false
    }
}

export const useLogout = () => {
    useCookie('access_token').value = ''
    useCookie('authCode').value = ''

    return useRouter().push('/login')
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}

interface AuthResponse {
    data: any
    error: FetchError<any> | null
}

export async function sendAuthCode(code: string): Promise<any> {
    return useFetch('auth', {
        method: 'POST',
        body: {
            code: code,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
}

export async function fetchUser(): Promise<any> {
    const runtimeConfig = useRuntimeConfig()
    const { data, error: errorRef } = await useFetch('users/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

export async function fetchUserUpdate(): Promise<any> {
    const runtimeConfig = useRuntimeConfig()
    const { data, error: errorRef } = await useFetch(`users/${useAuth().value.login}`, {
        method: 'PATCH',
        body: {
            username: useState<string>('Nickname', () => useAuth().value),
            image: useState<string>('ProfileAvatar', () => useAuth().value?.image),
        },
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

export const useAuth: any = async () => {
    const { error: errorRef } = await useFetch('/users/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return errorRef.value as FetchError<any> | null
}
