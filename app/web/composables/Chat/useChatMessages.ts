export async function useChatMessages(room_id: string, page: number = 1): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch(`chats/${room_id}/messages`, {
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      query: {
          page: page,
          sort: 'desc',
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}