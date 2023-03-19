export const useIsAuth = async () => {
    return useCookie('access_token').value

    // const { data, error: errorRef } = await useFetch('/users/me', {
    //     baseURL: useRuntimeConfig().API_URL,
    //     headers: {
    //         Authorization: `Bearer ${useCookie('access_token').value}`,
    //     },
    // })
    // return  true
}

export async function useLogin(code: string): Promise<any> {
    const { data, error: errorRef } = await useFetch('auth', {
        method: 'POST',
        body: {
            code: code,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}

export const useLogout = () => {
    useCookie('access_token').value = ''
    useCookie('authCode').value = ''
    return useRouter().push('/login')
}
