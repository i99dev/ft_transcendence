import { Injectable, UnauthorizedException } from '@nestjs/common'
import { intraConstants } from '../../common/constants/setting'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { IntraAccessToken, Me } from '../interface/intra.interface'

@Injectable()
export class AuthRepository {
    constructor(private readonly configService: ConfigService) {}

    async getIntraAccessToken(authCode: string): Promise<IntraAccessToken> {
        try {
            return (
                await axios.post(intraConstants.paths.token, {
                    grant_type: intraConstants.grant_type,
                    client_id: this.configService.getOrThrow<string>('auth.clientId'),
                    client_secret: this.configService.getOrThrow<string>('auth.clientSecret'),
                    code: authCode,
                    redirect_uri: this.configService.getOrThrow<string>('auth.redirectUri'),
                })
            ).data.access_token
        } catch (error) {
            throw new UnauthorizedException('Invalid Authorization Code')
        }
    }

    async getUserIntraProfile(accessToken: IntraAccessToken): Promise<Me> {
        try {
            return (
                await axios.get(intraConstants.paths.me, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            ).data
        } catch (error) {
            throw new UnauthorizedException('Invalid Intra User')
        }
    }
}
