export async function getNewAnnouncement(type: string): Promise<NotificationDto[] | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<any[]>(`/Notification/me/${type}`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}
