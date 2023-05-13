export const useIsAuth = async () => {
    const { data } = await useMe()
    return data.value ? true : false
}

export const refreshAccessToken = async () => {
    const { data, error } = await useFetch('/auth/refresh', {
        baseURL: useRuntimeConfig().API_URL,
    })
    const tokenInfo = data.value as AccessTokenDto | null
    if (tokenInfo) setCookies(tokenInfo)
    return error.value?.status
}

export async function useLogin(code: string): Promise<any> {
    const { data, error: errorRef } = await useFetch('auth/login', {
        method: 'POST',
        body: {
            code: code,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
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

interface FetchError<T> extends Error {
    status: number
    statusText: string
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

    const { data, error } = await useLogin(route.query.code.toString())

    const tokenInfo = data.value as AccessTokenDto | null
    if (tokenInfo) setCookies(tokenInfo)

    return data.value.access_token
        ? navigateTo('/')
        : data.value.two_fac_auth
        ? navigateTo({
              path: '/login/confirm',
              query: {
                  login: data.value.login,
                  two_fac_auth: data.value.two_fac_auth,
                  type: data.value.type,
                  code_length: data.value.code_length,
                  period: data.value.period,
              },
          })
        : await useIsAuth()
}

export const setCookies = (tokenInfo: AccessTokenDto) => {
    useCookie('access_token').value = tokenInfo.access_token
    useCookie('created_at').value = tokenInfo.created_at.toString()
    useCookie('expires_at').value = tokenInfo.expires_at
}
