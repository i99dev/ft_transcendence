export async function useUplaod(target: string, formData: any): Promise<any> {
    let resStatus = 0
    const { data, error: errorRef } = await useFetch(`multer/upload/${target}`, {
        onResponseError: error => {
            resStatus = error.response.status
        },
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        baseURL: useRuntimeConfig().API_URL,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, resStatus }
}
