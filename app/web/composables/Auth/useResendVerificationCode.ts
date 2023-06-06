export async function useResendVerificationCode(user: string): Promise<any> {
    const { data, error: errorRef } = await useFetch(`auth/2fa/resend/${user}`, {
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}
