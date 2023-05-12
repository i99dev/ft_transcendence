import { Injectable, UnauthorizedException } from '@nestjs/common'
import { intraConstants } from '../../common/constants/setting'
import { ConfigService } from '@nestjs/config'
import { IntraAccessToken, Me } from '../interface/intra.interface'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AuthRepository {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async getIntraAccessToken(authCode: string): Promise<IntraAccessToken> {
        try {
            return (
                await this.httpService.axiosRef.post(intraConstants.paths.token, {
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
                await this.httpService.axiosRef.get(intraConstants.paths.me, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            ).data
        } catch (error) {
            throw new UnauthorizedException('Invalid Intra User')
        }
    }
}
