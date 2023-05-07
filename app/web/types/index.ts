export {}

declare global {
    type UserStatus = 'OFFLINE' | 'ONLINE' | 'LIVE'
    type ChatRoomType = 'GROUP' | 'DM'
    type NotificationType =
        | 'ACHIEVEMENT'
        | 'FRIEND_REQUEST'
        | 'FRIEND_REQUEST_ACCEPTED'
        | 'MATCH_INVITE'
        | 'CHAT_INVITE'

    interface AccessTokenDto {
        access_token: string
        token_type: string
        expires_in: string
        created_at: number
    }

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
        wr: number
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
        color: string
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
        speed: number
        color: string
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
        opponents: PlayerStatusDto[]
    }

    interface GameSelectDto {
        gameType: string
        gameMode: string
        invitedID?: string
    }

    interface chatMessage {
        id: number
        content: string
        created_at: string
        type: string
        chat_room_id: string
        sender_login: string
        sender: UserGetDto
    }

    interface ChatRoom {
        room_id: string
        created_at: string
        type: ChatRoomType
        messages: chatMessage[]
    }

    interface GroupChat {
        id: number
        name: string
        image: string
        type: string
        password: string
        chat_room_id: string
        chat_room: ChatRoom
        chat_user: ChatUser[]
    }

    interface DirectChat {
        id: number
        chat_room_id: string
        chat_room: ChatRoom
        users: UserGetDto[]
    }

    interface ChatUser {
        id: number
        role: string
        status: string
        created_at: Date
        user_login: string
        chat_room_id: string
        user: UserGetDto
    }

    interface CreateNotificationDto {
        user_login: string
        content: string
        type: NotificationType
        target: string
    }
}
