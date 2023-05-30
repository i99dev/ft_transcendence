export async function useGameHistory(ep_URL: string): Promise<MatchHistoryDto[] | null> {
  const api = useRuntimeConfig().API_URL
  const { data } = await useFetch<MatchHistoryDto[]>(`${ep_URL}`, {
      method: 'GET',
      baseURL: api,
      headers: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
  })
  return data.value
}