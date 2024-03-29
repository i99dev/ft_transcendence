export {}

declare global {
    type UserStatus = 'OFFLINE' | 'ONLINE' | 'INGAME' | 'INQUEUE'
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
        expires_at: string
        created_at: string
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
        time: number
        countDown: number
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

    export interface PowerUp {
        type: 'Hiken' | 'Baika no Jutsu' | 'Shinigami' | 'Shunshin no Jutsu'
        active: boolean
        ready: boolean
        duration: number
        cooldown: number
    }

    export interface AchievementDto {
        id: number
        type:
            | 'Serial Killer'
            | 'Rookie no more'
            | 'First Blood'
            | 'No Sweat'
            | 'Paddle Samurai'
            | 'Table Ninja'
            | 'Ball Whisperer'
        description: string
        image: string
        users: UserGetDto[]
    }

    interface PlayerDto {
        login: string
        score: number
        paddle: PaddleDto
        gameID?: string
        powerUps: PowerUp[]
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
        powerups: string[]
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

    interface NotificationDto {
        id: number
        created_at: Date
        user_login?: string
        content: string
        type: NotificationType
        target?: string
        user?: UserGetDto
    }

    interface FetchError<T> extends Error {
        status: number
        statusText: string
    }

    interface InviteDto {
        inviterId: string
        invitedId: string
        gameType: string
        powerups: string[]
        accepted?: boolean
    }

    interface InviteModal {
        type: string
        open: boolean
        gameType: string
        target: string
        gameInProgress: boolean
        rejected: boolean
        playerStatus: string
    }

    interface InviteResponseDto {
        status: string
        playerStatus: string
        target: string
    }
}
