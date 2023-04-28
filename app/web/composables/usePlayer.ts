

export async function getPlayerWinRate(): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	console.log('API URL :', api)
	const { data, error: errorRef } = await useFetch<number>(`/achievement/winningrate`, {
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

export async function getPlayerGameResult(isWin: string, isLose: string): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<number>(`/achievement/totalgames?Win=${isWin}&Lose=${isLose}`, {
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
