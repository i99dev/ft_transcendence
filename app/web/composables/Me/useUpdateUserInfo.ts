export async function useUpdateUserInfo(info: UserGetDto): Promise<any> {
  const { user_info } = useUserInfo()
  const { data, error: errorRef } = await useFetch(`users/${user_info.value.login}`, {
      method: 'PATCH',
      body: info,
      baseURL: useRuntimeConfig().API_URL,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error }
}
