export const useAchievement = () => {
    const achievement = useState<any | null>('achievement', () => {})

    const setAchievement = (ach: any) => {
        achievement.value = ach
    }

    return { achievement, setAchievement }
}

export async function getNewAchievement(): Promise<any[] | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<any[]>(`/Notification/me/ACHIEVEMENT`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}

export async function getNewRank(): Promise<{ rank: string; isUp: boolean, id: number } | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<{ rank: string; isUp: boolean, id: number }>(`/achievement/newRank`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}

export async function deleteNewNotif(id: number): Promise<void> {
    const api = useRuntimeConfig().API_URL
    await fetch(`${api}/Notification/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
}

export async function getPlayerWinRate(player: string): Promise<number | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<number>(`/match-history/${player}/winningrate`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}

export async function getPlayerGameResult(
    player: string,
    isWin?: boolean,
): Promise<number | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<number>(
       isWin === undefined ? `/match-history/${player}/totalGames` : `/match-history/${player}/totalGames?isWin=${isWin}`,
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
