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

export const useGameHistory = () => {
    const game_history = useState<any | null>('game_history', () => {
        return {
            games: [
                {
                    id: 1,
                    player1: {
                        user: {
                            username: 'i99dev',
                            result: 'Win',
                            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                        },
                        score: 2,
                    },
                    player2: {
                        user: {
                            username: 'i88dev',
                            result: 'Lose',
                            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                        },
                        score: 0,
                    },
                },
                {
                    id: 2,
                    player1: {
                        user: {
                            username: 'i88dev',
                            result: 'Win',
                            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                        },
                        score: 5,
                    },
                    player2: {
                        user: {
                            username: 'i99dev',
                            result: 'Lose',
                            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                        },
                        score: 2,
                    },
                },
            ],
        }
    })

    const setGames = (games: any) => {
        game_history.value.games = games
    }

    return { game_history, setGames }
}
