import { IsString } from 'class-validator'
import { accessTokenConstants } from '../../common/constants/setting'
import { JwtService } from '@nestjs/jwt'
const jwtService = new JwtService()

export class TokenDto {
    access_token: string
    token_type: string
    expires_at: string
    created_at: string

    constructor(accessToken: string) {
        this.access_token = accessToken
        this.token_type = accessTokenConstants.type
        this.expires_at = jwtService.decode(accessToken)['exp']
        this.created_at = jwtService.decode(accessToken)['iat']
    }
}
export class TwoFacAuthDto {
    login: string
    two_fac_auth: boolean
    type: string
    code_length: number
    expired_at: number
}

export class AuthPostDto {
    @IsString()
    code: string
}
