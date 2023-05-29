
export async function getNewRank(): Promise<{ rank: string; isUp: boolean; id: number } | null> {
  const api = useRuntimeConfig().API_URL
  const { data } = await useFetch<{ rank: string; isUp: boolean; id: number }>(
      `/achievement/newRank`,
      {
          method: 'GET',
          baseURL: api,
          headers: {
              Authorization: `Bearer ${useCookie('access_token').value}`,
          },
      },
  )
  return data.value
}