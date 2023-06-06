export const useLogout = async () => {
    const { disconnectSockets } = useSockets()
    const { data, error: errorRef } = await useFetch('auth/logout', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    if (data.value) {
        disconnectSockets()
        useCookie('access_token').value = ''
        return useRouter().push('/login')
    }
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}
