export { };

declare global {

  type UserStatus = "OFFLINE" | "ONLINE" | "LIVE"
  type ChatRoomType = "GROUP" | "DM"

  interface User {
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
      friend_to?: User[]
      friends?: User[]
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
      y: number
      score: number
      paddle: PaddleDto
      gameId?: string
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

  interface chatMessage {
    id: number
    content: string
    created_at: string
    type: string
    chat_room_id: string
    sender_login: string
    sender: User
  }

  interface ChatRoom {
    room_id:      string
    created_at:   string
    type:         ChatRoomType
    messages:     chatMessage[]
  }

  interface groupChat {
    id:           number
    name:         string
    image:        string
    type:         string
    password:     string
    chat_room_id: string
    chat_room:    ChatRoom
    chat_user:    ChatUser[]
  }

  interface directChat {
    id:           number
    chat_room_id: string
    chat_room:    ChatRoom
    users:        User[]
  }

  interface ChatUser {
    id:           number
    role:         string
    status:       string
    created_at:   Date
    user_login:   string
    chat_room_id: string
    user:         User
  }
}