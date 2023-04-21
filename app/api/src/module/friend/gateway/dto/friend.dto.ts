import { IsString } from "class-validator";


export class FriendWs {
    @IsString()
    friend_login: string
}