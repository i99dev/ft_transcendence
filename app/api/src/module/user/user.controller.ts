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
    BadRequestException,
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
import { ParseStringPipe } from '@common/pipes/string.pipe'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard)
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
        @Query('sort', QueryParseStringPipe) sort: string,
        @Query('order', QueryParseStringPipe) order: string,
    ): Promise<UserGetDto[]> {
        const type = { [sort]: order }
        return await this.UserService.SortMany(type)
    }

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

    @Get('/search')
    async SearchUser(
        @Query('search', QueryParseStringPipe) search: string,
        @Query('page') page: number,
        @Req() req,
    ) {
        if (!search || search === '') return await this.UserService.SortMany({ id: 'asc' })
        else if (search.length > 255) throw new BadRequestException('Search is too long')

        if (!page || page < 1) page = 1
        return await this.UserService.SearchUser(search, page)
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
    async GetUser(@Param('name', ParseStringPipe) name: string): Promise<UserGetDto> {
        return await this.UserService.checkUser(await this.UserService.getUser(name))
    }

    @Get('username/:name/')
    async GetUserByUserName(@Param('name', ParseStringPipe) name: string): Promise<UserGetDto> {
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
        @Param('name', ParseStringPipe) name: string,
        @Body(new ValidationPipe()) data: UserPatchDto,
        @Req() req,
    ): Promise<UserGetDto> {
        if (name !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        const existingUser: UserGetDto = await this.UserService.getUserForPatch(name)
        return await this.UserService.updateUser(data, existingUser.login)
    }

    @Delete('/:name')
    async DeleteUser(
        @Param('name', ParseStringPipe) name: string,
        @Req() req,
    ): Promise<UserGetDto> {
        if (name !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        return await this.UserService.DeleteUser(name)
    }
}
