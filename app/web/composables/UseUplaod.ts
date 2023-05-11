export async function useUplaod(target: string, formData: any): Promise<any> {
  const { data, error: errorRef } = await useFetch(`multer/upload/${target}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
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
