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
