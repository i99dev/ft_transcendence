export const useIsAuth = async () => {
	if (!useCookie('access_token').value) return false
    const { data } = await useMe()
    return data.value ? true : false
}
