

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

export async function getPlayerTotalLoses(): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<number>(`/achievement/totalgames?Win=false&Lose=true`, {
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

export async function getPlayerTotalWins(): Promise<number | null> {
	const api = useRuntimeConfig().API_URL
	const { data, error: errorRef } = await useFetch<number>(`/achievement/totalgames?Win=flase&Lose=true`, {
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
		console.log('Total Win :', data.value)
	return data.value
}
