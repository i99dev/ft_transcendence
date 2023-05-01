import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FtAuthGuard } from '../common/guards/ft.auth.gaurd'
import { AuthService } from './auth.service'
import { AccessTokenDto } from './dto/auth.dto'
import { ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { authenticator } from 'otplib'
import { TwoFacAuthService } from './twoFacAuth.service'
import { UserService } from '../module/user/user.service'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private twoFacAuthService: TwoFacAuthService,
        private userService: UserService,
    ) {}

    // @UseInterceptors(LoggingInterceptor)
    @UseGuards(FtAuthGuard)
    @ApiOperation({
        operationId: 'getAuth',
        description: 'Get user by token',
        summary: 'Get user by token',
        tags: ['auth'],
    })
    @Post()
    async GetAuth(@Req() req, @Res() res): Promise<AccessTokenDto> {
        const { httpStatus, user } = await this.authService.getOrCreateUserAccountOnDb(req.user)

        // 2FA
        if (httpStatus === HttpStatus.OK && user.two_fac_auth) {
            if (await this.twoFacAuthService.send2FAConfirmationEmail(user))
                return res
                    .status(HttpStatus.OK)
                    .json({
                        "login": user.login,
                        "two_fac_auth": true,
                        "type": 'email',
                        "code_length": 6,
                        "period": 240,
                    })
            else
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('2FA Email failed to send')
        }

        const token: string = await this.authService.getJwt(user)

        return res.status(httpStatus).json(new AccessTokenDto(token))
    }

    @Post('confirm/:login')
    async confirm2FA(@Param('login') login: string, @Req() req, @Res() res): Promise<any> {
        const { code } = req.body
        if (!code) return res.status(HttpStatus.BAD_REQUEST).json('No code provided')

        const user = await this.userService.getUser(login)
        console.log(user)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const secret = await this.twoFacAuthService.getUser(login)
        if (!secret) return res.status(HttpStatus.NOT_FOUND).json('No 2FA requested for this user')

        const isValid = this.twoFacAuthService.verify2FA(login, code)
        if (isValid) {
            const token: string = await this.authService.getJwt(user)
            return res.status(HttpStatus.OK).json(new AccessTokenDto(token))
        } else return res.status(HttpStatus.BAD_REQUEST).json('Invalid code')
    }
}
