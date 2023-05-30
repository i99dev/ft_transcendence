export async function useDirectChatWith(user_login: string): Promise<any> {
  const {
      data,
      error: errorRef,
      refresh,
      pending,
  } = await useFetch(`chats/directChat/user/${user_login}`, {
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      server: false,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, refresh, pending }
}