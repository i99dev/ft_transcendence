export async function useUsersSearch(username: string): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch('users/search', {
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      query: {
          search: username,
      },
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}