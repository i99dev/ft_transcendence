export const useGameApi = () => {}

export const useGame = () => {
    const game_info = useState<any | null>('game_info', () => {
        return {
            gameModalOpen: false,
            game: null,
        }
    })

    const setGameModalOpen = (open: boolean) => {
        game_info.value.gameModalOpen = open
    }

    const setGame = (game: any) => {
        game_info.value.game = game
    }

    return { game_info, setGameModalOpen, setGame }
}

export async function useGameHistory(ep_URL: string): Promise<MatchHistoryDto[] | null> {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch<MatchHistoryDto[]>(`${ep_URL}`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value
    if (error)
        console.error('Failed to get match history:', error)
    else
        console.log('Match history:', data.value)
    return data.value
}



export async function useGameHistoryPages(login: string): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<number>(`/match-history/${login}/totalPages`, {
		method: 'GET',
		baseURL: api,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	const error = errorRef.value
	if (error)
		console.error('Failed to get pages:', error)
	else
		console.log('Match history Page number:', data.value)
	return data.value
}



