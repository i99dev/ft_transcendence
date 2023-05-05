import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { FtAuthGuard } from '../common/guards/ft.auth.gaurd'
import { AuthService } from './auth.service'
import { AccessTokenDto, TwoFacAuthDto } from './dto/auth.dto'
import { ApiOperation } from '@nestjs/swagger'
import { TwoFacAuthService } from './twoFacAuth.service'
import { UserService } from '../module/user/user.service'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
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
    async GetAuth(@Req() req, @Res() res): Promise<AccessTokenDto | TwoFacAuthDto | string> {
        const { httpStatus, user } = await this.authService.getOrCreateUserAccountOnDb(req.user)

        // 2FA
        if (httpStatus === HttpStatus.OK && user.two_fac_auth) {
            const {status, two_fac_auth_info} = await this.twoFacAuthService.handle2FA(user)
            return res.status(status).json(two_fac_auth_info)
        }

        const token: string = await this.authService.getJwt(user)

        return res.status(httpStatus).json(new AccessTokenDto(token))
    }

    @Get('2fa/resend/:login')
    async resendVerificationCode(@Param('login') login: string, @Res() res): Promise< TwoFacAuthDto| string> {
        const user = await this.userService.getUser(login)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const secret = await this.twoFacAuthService.getUser(login)
        if (!secret) return res.status(HttpStatus.NOT_FOUND).json('No 2FA requested for this user')

        if (!this.twoFacAuthService.getIsAllowedToSend(login)) return res.status(HttpStatus.UNAUTHORIZED).json(`User can't resend OTP within 30s`)

        const {status, two_fac_auth_info} = await this.twoFacAuthService.handle2FA(user)
        return res.status(status).json(two_fac_auth_info)
    }

    @Post('2fa/confirm/:login')
    async confirm2FA(@Param('login') login: string, @Req() req, @Res() res): Promise<AccessTokenDto | string> {
        const { code } = req.body
        if (!code) return res.status(HttpStatus.BAD_REQUEST).json('No code provided')

        const user = await this.userService.getUser(login)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const secret = await this.twoFacAuthService.getUser(login)
        if (!secret) return res.status(HttpStatus.NOT_FOUND).json('No 2FA requested for this user')

        const isValid = this.twoFacAuthService.verify2FA(login, code)
        if (isValid) {
            const token: string = await this.authService.getJwt(user)
            return res.status(HttpStatus.OK).json(new AccessTokenDto(token))
        } else return res.status(HttpStatus.NOT_FOUND).json('Invalid code')
    }
}
