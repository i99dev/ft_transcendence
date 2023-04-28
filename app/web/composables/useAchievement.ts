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
	if (error)
		console.error('Failed to get :', error)
	else
		console.log('new achievement: ', data.value)
	return data.value
}
