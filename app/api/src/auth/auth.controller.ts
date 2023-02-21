import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common'
import { FtAuthGuard } from '../common/guards/ft.auth.gaurd'
import { LoggingInterceptor } from '../common/interceptors/perfomance.interceptors'
import { AuthService } from './auth.service'
import { AccessTokenDto } from './dto/auth.dto'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
        const { httpStatus, user } = await this.authService.checkUserAccountOnDb(req.user)
        const token: string = await this.authService.getJwt(user)

        return res.status(httpStatus).json(new AccessTokenDto(token))
    }
}
