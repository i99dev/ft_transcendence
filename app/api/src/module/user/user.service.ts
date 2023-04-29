import { UserGetDto, UserPatchDto } from './dto/user.dto'
import { User } from '@prisma/client'
import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { UserRepository } from './repository/user.repository'
import { Me } from '../../auth/interface/intra.interface'
import { NotFoundException } from '@nestjs/common'

@Injectable({})
export class UserService {
    constructor(private prisma: PrismaService, private repository: UserRepository) {}

    async checkUser(user: UserGetDto): Promise<UserGetDto> {
        if (!user) {
            throw new NotFoundException(`User ${user} does not exist`)
        }
        return user
    }

    async getUser(name: string): Promise<UserGetDto> {
        const user: UserGetDto = await this.prisma.user.findUnique({
            where: { login: name },
            include: {
                friend_to: true,
                friends: true,
            },
        })
        return user
    }

    async getUserForPatch(name: string): Promise<UserGetDto> {
        const user = await this.prisma.user.findUnique({
            where: { login: name },
        })
        if (!user) {
            throw new NotFoundException(`User ${name} does not exist`)
        }
        return user
    }

    async updateUser(data: User): Promise<User> {
        return await this.prisma.user.update({
            where: { login: data.login },
            data,
        })
    }

    async CreateUser(intraUser: Me) {
        return await this.prisma.user.create({
            data: await this.repository.CreateUserObject(intraUser),
        })
    }

    async SortMany(orderBy: object): Promise<UserGetDto[]> {
        if (orderBy == null) orderBy = { id: 'asc' }
        const sortedUsers: UserGetDto[] = await this.prisma.user.findMany({
            orderBy: orderBy,
            include: {
                friend_to: true,
                friends: true,
            },
        })
        if (!sortedUsers) {
            throw new NotFoundException(`User ${name} does not exist`)
        }
        return sortedUsers
    }

    async DeleteUser(name: string): Promise<UserGetDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { login: name },
        })
        if (!existingUser) {
            throw new NotFoundException(`User ${name} not found`)
        }
        return this.repository.deleteUser(name)
    }

    async SearchUser(search: string) {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    login: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            })
            return users
        } catch (error) {
            console.log(error)
        }
    }

    async getUserbyUserName(name: string): Promise<UserGetDto> {
        const user: UserGetDto = await this.prisma.user.findUnique({
            where: { username: name },
            include: {
                friend_to: true,
                friends: true,
            },
        })
        return user
    }
}
