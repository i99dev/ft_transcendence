export async function getPlayerGameResult(player: string, isWin?: boolean): Promise<number | null> {
  const api = useRuntimeConfig().API_URL
  const { data } = await useFetch<number>(
      isWin === undefined
          ? `/match/${player}/totalGames`
          : `/match/${player}/totalGames?isWin=${isWin}`,
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