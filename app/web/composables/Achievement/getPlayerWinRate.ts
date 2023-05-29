export async function getPlayerWinRate(player: string): Promise<number | null> {
  const api = useRuntimeConfig().API_URL
  const { data } = await useFetch<number>(`/match/${player}/winningrate`, {
      method: 'GET',
      baseURL: api,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
  })
  return data.value
}