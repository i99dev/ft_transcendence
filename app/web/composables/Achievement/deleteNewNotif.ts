export async function deleteNewNotif(id: number): Promise<void> {
    const api = useRuntimeConfig().API_URL
    await fetch(`${api}/Notification/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
}
