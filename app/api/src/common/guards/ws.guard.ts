import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { WsException } from '@nestjs/websockets'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class WsGuard implements CanActivate {
    private jwtService = new JwtService()
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient()
        if (!client.handshake.headers.authorization) throw new WsException('No Token Provided')

        let jwt = client.handshake.headers.authorization
        jwt = jwt.split(' ')[1]
        try {
            const payload = this.jwtService.verify(jwt, { secret: process.env.JWT_SECRET })
            client.handshake.auth = payload
            return true
        } catch {
            client.disconnect()
            return false
        }
    }
}
