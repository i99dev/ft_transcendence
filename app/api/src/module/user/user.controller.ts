import { UserPatchValidationPipe } from './pipes/user.pipe'
import { User } from '@prisma/client'
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
    UsePipes,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
    ApiQuery,
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
        let type = { [sort]: order }
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
    GetUser(@Param('name') name: string): Promise<UserGetDto> {
        return this.UserService.getUser(name)
    }

    @Patch('/:name')
    @ApiOperation({
        operationId: 'updateUser',
        description: 'Update user by name',
        summary: 'Update user by name',
        tags: ['users'],
    })
    @ApiParam({
        name: 'first_name',
        description: 'User first name',
        type: String,
    })
    @ApiQuery({
        name: 'last_name',
        description: 'User last name',
        type: String,
    })
    @ApiQuery({
        name: 'password',
        description: 'User password',
        type: String,
    })
    @ApiQuery({
        name: 'email',
        description: 'User email',
        type: String,
    })
    @ApiQuery({
        name: 'login',
        description: 'User login',
        type: String,
    })
    @UsePipes(new UserPatchValidationPipe())
    async UpdateUser(
        @Param('name') name: string,
        @Body() data1: UserPatchDto,
    ): Promise<UserGetDto> {
        const existingUser: UserGetDto = await this.UserService.getUserForPatch(name)
        const updatedUser: User = Object.assign({}, existingUser, data1)
        return await this.UserService.updateUser(updatedUser)
    }

    @Delete('/:name')
    async DeleteUser(@Param('name') name: string): Promise<UserGetDto> {
        return await this.UserService.DeleteUser(name)
    }
}
