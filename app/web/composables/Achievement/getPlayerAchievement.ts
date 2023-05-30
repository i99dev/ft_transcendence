export async function getPlayerAchievement(login: string): Promise<any | null> {
  const api = useRuntimeConfig().API_URL
  const { data } = await useFetch<any>(`/achievement/user/${login}`, {
      method: 'GET',
      baseURL: api,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
  })
  return data.value
}