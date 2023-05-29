import { useToast } from 'primevue/usetoast'

export async function useNotifications() {
    const toast = useToast()
    const getNotifications = async () => {
        const { data, error } = await useFetch('/Notification/me', {
            method: 'GET',
            baseURL: useRuntimeConfig().API_URL,
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
        })
        if (error.value)
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: `can't retrieve friends notification`,
                life: 3000,
            })
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
        if (error.value)
            toast.add({
                severity: 'error',
                summary: 'Opps!',
                detail: `can't delete friend notification`,
                life: 3000,
            })
    }
    return { getNotifications, deleteNotification }
}
