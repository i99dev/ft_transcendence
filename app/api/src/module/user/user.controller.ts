import { UserGetDto, UserPatchDto } from './dto/user.dto'
import { UserService } from './user.service'
import {
    Body,
    Get,
    Controller,
    Param,
    Patch,
    Delete,
    Query,
    UseGuards,
    Req,
    ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@Controller('/users')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get()
    @ApiOperation({
        operationId: 'getUsers',
        description: 'Get users this only for admins',
        summary: 'Get users',
        tags: ['users'],
    })
    async GetUsers(
        @Query('sort') sort: string,
        @Query('order') order: string,
    ): Promise<UserGetDto[]> {
        const type = { [sort]: order }
        return await this.UserService.SortMany(type)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    @ApiOperation({
        operationId: 'getMe',
        description: 'Get user by token',
        summary: 'Get user by token',
        tags: ['users'],
    })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully returned.',
        type: UserGetDto,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async GetMe(@Req() req): Promise<UserGetDto> {
        return await this.UserService.getUser(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search')
    async SearchUser(@Query('search') search: string, @Req() req) {
        return await this.UserService.SearchUser(search)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search/:name')
    async SearchUserByName(@Param('name') name: string) {
        return await this.UserService.SearchUserNames(name)
    }

    @Get('/:name')
    @ApiOperation({
        operationId: 'getUser',
        description: 'Get user by name',
        summary: 'Get user by name',
        tags: ['users'],
    })
    @ApiParam({
        name: 'name',
        description: 'User name',
        type: String,
        required: true,
    })
    async GetUser(@Param('name') name: string): Promise<UserGetDto> {
        return await this.UserService.checkUser(await this.UserService.getUser(name))
    }

    @Get('username/:name/')
    async GetUserByUserName(@Param('name') name: string): Promise<UserGetDto> {
        return await this.UserService.checkUser(await this.UserService.getUserbyUserName(name))
    }

    @Patch('/:name')
    @ApiOperation({
        operationId: 'updateUser',
        description: 'Update user by name',
        summary: 'Update user by name',
        tags: ['users'],
    })
    @ApiBody({
        type: UserPatchDto,
        description: 'User data',
        required: true,
    })
    async UpdateUser(
        @Param('name') name: string,
        @Body(new ValidationPipe()) data: UserPatchDto,
    ): Promise<UserGetDto> {
        const existingUser: UserGetDto = await this.UserService.getUserForPatch(name)
        return await this.UserService.updateUser(data)
    }

    @Delete('/:name')
    async DeleteUser(@Param('name') name: string): Promise<UserGetDto> {
        return await this.UserService.DeleteUser(name)
    }
}
