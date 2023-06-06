export const useIsAuth = async () => {
    const { data } = await useMe()
    return data.value ? true : false
}
