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

@Controller('/users')
export class UserController {
		constructor(private readonly UserService: UserService) {}

		@Get()
		async GetUsers(
				@Query('sort') sort: string,
				@Query('order') order: string,
		): Promise<UserGetDto[]> {
				let type = { [sort]: order }
				return await this.UserService.SortMany(type)
		}

		@UseGuards(JwtAuthGuard)
		@Get('/me')
		async GetMe(@Req() req): Promise<UserGetDto> {
				console.log(`name: ${req.user.login}`)
				return await this.UserService.getUser(req.user.login)
		}

		@Get('/:name')
		GetUser(@Param('name') name: string): Promise<UserGetDto> {
				return this.UserService.getUser(name)
		}

		@Patch('/:name')
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
