export async function useUsers(): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch('users', {
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}

export async function useUsersSearch(username: string): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch('users/search', {
      baseURL: useRuntimeConfig().API_URL,
      query: {
        username: username
      },
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}


interface FetchError<T> extends Error {
  status: number
  statusText: string
}
