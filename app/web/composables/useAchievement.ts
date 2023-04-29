export const useAchievement = () => {
    const achievement = useState<any | null>('achievement', () => {})

    const setAchievement = (ach: any) => {
        achievement.value = ach
    }

    return { achievement, setAchievement }
}

export async function getNewAchievement(): Promise<string[] | null> {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch<string[]>(`/achievement/new`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value
    if (error) console.error('Failed to get :', error)
    else console.log('new achievement: ', data.value)
    return data.value
}

export async function deleteNewAchievement(content: string): Promise<void> {
	console.log('delete achievement')
	const api = useRuntimeConfig().API_URL
    const response = await fetch(`${api}/Notification/achievement?content=${content}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
	console.log(response)
}

export async function getPlayerWinRate(player: string): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	console.log('API URL :', api)
	const { data, error: errorRef } = await useFetch<number>(`/achievement/winningrate/${player}`, {
		method: 'GET',
		baseURL: api,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	const error = errorRef.value
	if (error)
		console.error('Failed to get :', error)
	else
		console.log('Win Rate :', data.value)
	return data.value
}

export async function getPlayerGameResult(player:string, isWin: string, isLose: string): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<number>(`/achievement/totalgames/${player}?Win=${isWin}&Lose=${isLose}`, {
		method: 'GET',
		baseURL: api,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	const error = errorRef.value
	if (error)
		console.error('Failed to get :', error)
	else
		console.log('Total Lose :', data.value)
	return data.value
}

export async function getPlayerAchievement(): Promise<any | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<any>(`/achievement`, {
		method: 'GET',
		baseURL: api,
		headers: {
			Authorization: `Bearer ${useCookie('access_token').value}`,
		},
	})
	const error = errorRef.value
	if (error)
		console.error('Failed to get :', error)
	else
		console.log('achievement: ', data.value)
	return data.value
}