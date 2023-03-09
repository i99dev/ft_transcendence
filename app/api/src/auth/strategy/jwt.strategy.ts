import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Payload } from '../interface/auth.interface'
import { ConfigService } from '@nestjs/config'
// import { CONFIGURABLE_MODULE_ID } from '@nestjs/common/module-utils/constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret', 'jwt_secret'),
        })
    }

    async validate(payload: any): Promise<Payload> {
        console.log(`payload: ${payload}`)
        return { id: payload.id, login: payload.login }
    }
}
