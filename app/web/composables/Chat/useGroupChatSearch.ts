export async function useGroupChatSearch(name: string): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch('chats/groupChat/search', {
      baseURL: useRuntimeConfig().API_URL,
      query: {
          name: name,
      },
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}