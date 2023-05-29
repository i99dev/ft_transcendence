export async function useGetGroupChatParticipants(
  room_id: string,
  user_type: string = 'NORMAL',
): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch(`chats/${room_id}/users`, {
      baseURL: useRuntimeConfig().API_URL,
      query: { type: 'GROUP', user_type: user_type },
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}