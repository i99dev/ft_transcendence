import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common'
import { FtAuthGuard } from '../common/guards/ft.auth.gaurd'
import { LoggingInterceptor } from '../common/interceptors/perfomance.interceptors'
import { AuthService } from './auth.service'
import { AccessTokenDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @UseInterceptors(LoggingInterceptor)
    @UseGuards(FtAuthGuard)
    @Post()
    async GetAuth(@Req() req, @Res() res): Promise<AccessTokenDto> {
        const { httpStatus, user } = await this.authService.checkUserAccountOnDb(req.user)
        const token: string = await this.authService.getJwt(user)

        return res.status(httpStatus).json(new AccessTokenDto(token))
    }
}
