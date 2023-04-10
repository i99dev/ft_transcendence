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
    if (error) {
        console.error('Failed to get match history:', error)
    } else {
        console.log('Match history:', data.value)
    }
    return data.value
}


// export const useGameHistory = () => {
//     const game_history = useState<MatchHistoryDto[] | null>('game_history')

//     const setGames = (games: MatchHistoryDto[] | null) => {
//         game_history.value = games
//     }

//     const getMatchHistory = async () => {
//         const api = useRuntimeConfig().API_URL
//         const { data, error: errorRef } = await useFetch<Array<MatchHistoryDto>>('/match-history', {
//             method: 'GET',
//             baseURL: api,
//             headers: {
//                 Authorization: `Bearer ${useCookie('access_token').value}`,
//             },
//         })
//         const error = errorRef.value
//         if (error) {
//             console.error('Failed to get match history:', error)
//         } else {
//             setGames(data.value)
//             console.log('Match history:', data.value)
//         }
//     }

//     return { game_history, setGames, getMatchHistory }

// }

export interface UserDto {
    id: number
    login: string
    username: string
    email: string
    status: UserStatus
    first_name: string
    last_name: string
    created_at: Date
    last_login: Date
    image: string
    exp_level: number
    points: number
    two_fac_auth: boolean
    friend_to?: UserDto[]
    friends?: UserDto[]
    player?: PlayerDto[]
}

export interface PlayerDto {
    id: number
    score: number
    IsWinner: boolean
    user: UserDto
    // matches: MatchHistoryDto
}

export interface MatchHistoryDto {
    gameID: string
    start: Date
    end: Date
    opponents: PlayerDto[]
}




