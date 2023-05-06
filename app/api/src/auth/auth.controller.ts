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
import { TokenDto, TwoFacAuthDto } from './dto/auth.dto'
import { ApiOperation } from '@nestjs/swagger'
import { TwoFacAuthService } from './twoFacAuth.service'
import { UserService } from '../module/user/user.service'
import { JwtAuthGuard } from '../common/guards/jwt.guard'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private twoFacAuthService: TwoFacAuthService,
        private userService: UserService,
    ) {}
    

    @UseGuards(FtAuthGuard)
    @ApiOperation({
        operationId: 'getAuth',
        description: 'Get user by token',
        summary: 'Get user by token',
        tags: ['auth'],
    })
    @Post('login')
    async GetAuth(@Req() req, @Res() res): Promise<TokenDto | TwoFacAuthDto | string> {
        const { httpStatus, user } = await this.authService.getOrCreateUserAccountOnDb(req.user)

        // 2FA
        if (httpStatus === HttpStatus.OK && user.two_fac_auth) {
            const {status, two_fac_auth_info} = await this.twoFacAuthService.handle2FA(user)
            return res.status(status).json(two_fac_auth_info)
        }

        const {accessToken, refreshToken} = this.authService.getUserTokens(user)
        res.cookie('refresh_token', refreshToken, this.authService.getRefreshTokenObj())

        return res.status(httpStatus).json(new TokenDto(accessToken))
    }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    async Logout(@Res() res): Promise<string> {
        res.clearCookie('refresh_token')
        return res.status(HttpStatus.OK).json('Logout success')
    }

    @Get('refresh')
    async GetNewAccessToken(@Req() req, @Res() res): Promise<TokenDto | string> {
        console.log(req.headers.cookie)

        const tok = this.authService.extractRefreshTokenFromCookies(req.headers.cookie)
        const user = await this.authService.getUserByToken(tok)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const {accessToken, refreshToken} = this.authService.getUserTokens(user)
        res.cookie('refresh_token', refreshToken, this.authService.getRefreshTokenObj())

        return res.status(HttpStatus.OK).json(new TokenDto(accessToken))
    }

    @Get('2fa/resend/:login')
    async resendVerificationCode(@Param('login') login: string, @Res() res): Promise< TwoFacAuthDto| string> {
        const user = await this.userService.getUser(login)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const secret = await this.twoFacAuthService.getUser(login)
        if (!secret) return res.status(HttpStatus.NOT_FOUND).json('No 2FA requested for this user')

        const {status, two_fac_auth_info} = await this.twoFacAuthService.handle2FA(user)
        return res.status(status).json(two_fac_auth_info)
    }

    @Post('2fa/confirm/:login')
    async confirm2FA(@Param('login') login: string, @Req() req, @Res() res): Promise<TokenDto | string> {
        const { code } = req.body
        if (!code) return res.status(HttpStatus.BAD_REQUEST).json('No code provided')

        const user = await this.userService.getUser(login)
        if (!user) return res.status(HttpStatus.NOT_FOUND).json('User not found')

        const secret = await this.twoFacAuthService.getUser(login)
        if (!secret) return res.status(HttpStatus.NOT_FOUND).json('No 2FA requested for this user')

        const isValid = this.twoFacAuthService.verify2FA(login, code)
        if (isValid) {
            const {accessToken, refreshToken} = this.authService.getUserTokens(user)
            res.cookie('refresh_token', refreshToken, this.authService.getRefreshTokenObj());  
    
            return res.status(HttpStatus.OK).json(new TokenDto(accessToken))
        } else return res.status(HttpStatus.NOT_FOUND).json('Invalid code')
    }
}
