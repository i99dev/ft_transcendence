import { ConfigService } from '@nestjs/config'
import { IsString } from 'class-validator'
import { accessTokenConstants } from '../../common/constants/setting'
const configService = new ConfigService()

export class AccessTokenDto {
    access_token: string
    token_type: string
    expires_in: number
    created_at: number

    constructor(accessToken: string) {
        this.access_token = accessToken
        this.token_type = accessTokenConstants.type
        this.expires_in = configService.get<number>('jwt.expriesIn')
        this.created_at = Date.now()
    }
}
export class TwoFacAuthDto {
    login: string
    two_fac_auth: boolean
    type: string
    code_length: number
    period: number

}

export class AuthPostDto {
    @IsString()
    code: string
}
