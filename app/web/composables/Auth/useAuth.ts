export const useAuth = async (route: any) => {
    if (route.path === '/callback' && !route.query.code) return navigateTo('/login')

    const { data, error, status } = await useLogin(route.query.code.toString())

    const tokenInfo = data.value as AccessTokenDto | null
    if (tokenInfo) setCookies(tokenInfo)

    if (status === 201) {
        const { isFirstTimeLogin, setIsFirstTimeLogin } = useIsFirstTime()
        setIsFirstTimeLogin(true)
    }

    return data.value?.access_token
        ? navigateTo('/')
        : data.value?.two_fac_auth
        ? navigateTo({
              path: '/login/confirm',
              query: {
                  login: data.value?.login,
                  two_fac_auth: data.value?.two_fac_auth,
                  type: data.value?.type,
                  code_length: data.value?.code_length,
                  expired_at: data.value?.expired_at,
              },
          })
        : await useIsAuth()
}
