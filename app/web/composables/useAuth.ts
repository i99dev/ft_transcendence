export const useIsAuth = async () => {
    const { data } = await useMe()
    return data.value ? true : false
}

export const refreshAccessToken = async (reconnect: boolean = true) => {
    const { reconnectSockets, updateSocketsToken } = useSockets()
    const { data, error } = await useFetch('/auth/refresh', {
        baseURL: useRuntimeConfig().API_URL,
    })
    const tokenInfo = data.value as AccessTokenDto | null
    if (tokenInfo) await setCookies(tokenInfo)
    updateSocketsToken()
    return error.value?.status
}

export async function useLogin(code: string): Promise<any> {
    let status = 200
    const { data, error: errorRef } = await useFetch('auth/login', {
        onResponse({ response }) {
            status = response.status
        },
        method: 'POST',
        body: {
            code: code,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, status }
}

export async function useResendVerificationCode(user: string): Promise<any> {
    const { data, error: errorRef } = await useFetch(`auth/2fa/resend/${user}`, {
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

export async function useSubmitConfirmationCode(user: string, code: string): Promise<any> {
    const { data, error: errorRef } = await useFetch(`auth/2fa/confirm/${user}`, {
        method: 'POST',
        body: {
            code: code,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

export const useLogout = async () => {
    const { data, error: errorRef } = await useFetch('auth/logout', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    if (data.value) {
        useCookie('access_token').value = ''
        return useRouter().push('/login')
    }
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

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

export const useIsFirstTime = () => {
    const isFirstTimeLogin = useState<boolean>('first_time_login', () => false)

    const setIsFirstTimeLogin = (status: boolean) => {
        isFirstTimeLogin.value = status
    }

    return { isFirstTimeLogin, setIsFirstTimeLogin }
}

export const setCookies = (tokenInfo: AccessTokenDto) => {
    useCookie('access_token').value = tokenInfo.access_token
    useCookie('created_at').value = tokenInfo.created_at
    useCookie('expires_at').value = tokenInfo.expires_at
}
