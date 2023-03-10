
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

interface FetchError<T> extends Error {
  status: number
  statusText: string
}