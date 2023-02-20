import { UserGetDto, UserPatchDto } from './dto/user.dto'
import { PrismaClient, User } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { UserRepository } from './repository/user.repository'
import { Me } from '../../auth/interface/intra.interface'
import { NotFoundException } from '@nestjs/common'

@Injectable({})
export class UserService {
    constructor(private repository: UserRepository) {}
    prisma = new PrismaClient()

    async checkUser(user: Promise<UserGetDto>) {
        if (!user) {
            throw new NotFoundException(`User ${name} does not exist`)
        }
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
}
