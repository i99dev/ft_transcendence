import { UserGetDto } from '../module/user/dto/user.dto'
import { Injectable, HttpStatus } from '@nestjs/common'
import { IntraAccessToken, Me } from './interface/intra.interface'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../module/user/user.service'
import { AuthRepository } from './repository/auth.repository'
import { User } from '@prisma/client'

@Injectable({})
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private authrepository: AuthRepository,
    ) {}

    async getOrCreateUserAccountOnDb(
        intraUser,
    ): Promise<{ httpStatus: HttpStatus; user: UserGetDto }> {
        const myuser: UserGetDto = await this.userService.getUser(intraUser.login)
        if (!myuser) {
            return {
                httpStatus: HttpStatus.CREATED,
                user: await this.userService.CreateUser(intraUser),
            }
        }
        return { httpStatus: HttpStatus.OK, user: myuser }
    }

    async validateUserWithIntra(code: string): Promise<Me> {
        const intraToken: IntraAccessToken = await this.authrepository.getIntraAccessToken(code)
        return await this.authrepository.getUserIntraProfile(intraToken)
    }

    async getJwt(user: UserGetDto): Promise<string> {
        const payload = {
            id: user.id,
            login: user.login,
        }
        return this.jwtService.sign(payload)
    }

    async getUserByToken(token: string): Promise<UserGetDto> {
        const payload = this.jwtService.verify(token)
        return payload ? await this.userService.getUser(payload.login) : undefined
    }

    getUserTokens(user: UserGetDto): { accessToken: string; refreshToken: string } {
        const payload = {
            id: user.id,
            login: user.login,
        }
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
        }
    }

    getRefreshTokenObj() {
        return {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 30 days
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Fallback for older browsers
        }
    }
}
