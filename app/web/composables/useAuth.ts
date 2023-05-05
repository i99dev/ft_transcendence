export const useIsAuth = async () => {
    const { data, error: errorRef } = await useFetch('/users/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}

export async function useLogin(code: string): Promise<any> {
    const { data, error: errorRef } = await useFetch('auth', {
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

export const useLogout = () => {
    useCookie('access_token').value = ''
    return useRouter().push('/login')
}

export const useAuth = async (route: any) => {
    if (route.path === '/callback' && !route.query.code) return navigateTo('/login')

    const { data, error } = await useLogin(route.query.code.toString())

    if (data.value.access_token) useCookie('access_token').value = data.value.access_token

    return data.value.access_token
        ? navigateTo('/')
        : data.value.two_fac_auth
        ? navigateTo({
            path: '/login/confirm',
            query: {
                "login": data.value.login,
                "two_fac_auth": data.value.two_fac_auth,
                "type": data.value.type,
                "code_length": data.value.code_length,
                "period": data.value.period,
            }
        })
        : navigateTo('/login')
}
