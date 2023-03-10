
export async function useGetMe(): Promise<any> {
  const { data, error: errorRef } = await useFetch('users/me', {
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error }
}

interface FetchError<T> extends Error {
  status: number
  statusText: string
}