import { useToast } from 'primevue/usetoast'

export async function useNotifications() {
    const getNotifications = async () => {
        const { data, error } = await useFetch('/Notification/me', {
            method: 'GET',
            baseURL: useRuntimeConfig().API_URL,
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
        })
        if (error) useToast().add({
            severity: 'error',
            summary: 'Opps!',
            detail: `can't delete conthe notification (${error.value})`,
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
        if (error) useToast().add({
            severity: 'error',
            summary: 'Opps!',
            detail: `can't delete the notification (${error.value})`,
            life: 3000,
        })
    }
    return { getNotifications, deleteNotification }
}
