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
