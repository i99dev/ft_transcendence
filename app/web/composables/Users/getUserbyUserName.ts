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
