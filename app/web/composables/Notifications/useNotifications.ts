export async function useNotifications() {
    const getNotifications = async () => {
        const { data, error } = await useFetch('/Notification/me', {
            method: 'GET',
            baseURL: useRuntimeConfig().API_URL,
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
        })
        if (error) console.log('Error Fetching Notifications: ', error.value)
        return data
    }

    const deleteNotification = async (id: number) => {
        const { data, error } = await useFetch(`/Notification/${id}`, {
            method: 'DELETE',
            baseURL: useRuntimeConfig().API_URL,
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
        })
        if (error) console.log('Error Deleting Notification: ', error.value)
    }
    return { getNotifications, deleteNotification }
}
