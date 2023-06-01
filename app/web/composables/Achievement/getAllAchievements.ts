export async function getAllAchievements(): Promise<any | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<any>(`/achievement`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}
