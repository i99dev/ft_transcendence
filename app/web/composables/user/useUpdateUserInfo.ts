export async function useUpdateUserInfo(login: string, payload : any): Promise<any> {
  const { data, error: errorRef } = await useFetch(`users/${login}`, {
      method: 'PATCH',
      body: payload,
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