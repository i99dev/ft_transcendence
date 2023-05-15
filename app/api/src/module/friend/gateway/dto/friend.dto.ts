import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class FriendWs {
    @IsString()
    @IsNotEmpty()
    @Matches(/^([a-z]{1,8})([-]{0,1})([a-z]{1,8})$/g)
    friend_login: string
}
