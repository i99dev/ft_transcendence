export const refreshAccessToken = async (reconnect: boolean = true) => {
    const { updateSocketsToken } = useSockets()
    const { data, error } = await useFetch('/auth/refresh', {
        baseURL: useRuntimeConfig().API_URL,
    })
    const tokenInfo = data.value as AccessTokenDto | null
    if (tokenInfo) await setCookies(tokenInfo)
    updateSocketsToken()
    return error.value?.status
}
