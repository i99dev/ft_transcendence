export async function useUpdateUserInfo(payload: any): Promise<any> {
    const { login, username, email, image } = payload
    const { data, error: errorRef } = await useFetch(`users/${login}`, {
        method: 'PATCH',
        body: {
            username,
            image,
        },
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
