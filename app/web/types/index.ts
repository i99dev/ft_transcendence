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
      total_wins: number
      total_loses: number
      exp_level: number
      points: number
      two_fac_auth: boolean
      friend_to?: UserGetDto[]
      friends?: UserGetDto[]
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
	  x: number
      y: number
      score: number
      paddle: PaddleDto
      gameId?: string
	  powerUp?: boolean
  }
  
  interface PaddleDto {
      width: number
      height: number
  }

  interface gameObjects {
    score: {
      size: number
    }
  }
}