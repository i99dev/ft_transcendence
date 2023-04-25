export { };

declare global {

  type UserStatus = "OFFLINE" | "ONLINE" | "LIVE"

  interface UserGetDto {
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
	xp: number
	ladder: number
    two_fac_auth: boolean
    friend_to?: UserGetDto[]
    friends?: UserGetDto[]
    player?: PlayerStatusDto[]
  }

  interface gameStatusDto {
    players: PlayerDto[]
    ball: BallDto
  }

  interface SetupDto {
    game: gameStatusDto
    player: number
  }

  interface BallDto {
    x: number
    y: number
    dx: number
    dy: number
    radius: number
  }

  interface PlayerDto {
    username: string
    score: number
    paddle: PaddleDto
    gameId?: string
    powerUp?: boolean
  }

  interface PaddleDto {
    x: number
    y: number
    width: number
    height: number
  }

  interface gameObjects {
    score: {
      size: number
    }
  }
  interface PlayerStatusDto {
    id: number
    score: number
    IsWinner: boolean
    user: UserGetDto
    // matches: MatchHistoryDto
  }
  interface MatchHistoryDto {
    gameID: string
    start: Date
    end: Date
    opponents: PlayerDto[]
  }

  interface GameSelectDto {
    gameType: string  
    gameMode: string
    invitedID?: string
  }
}
