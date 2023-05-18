import { UserStatus } from '@prisma/client'
import { NewUser } from '@module/user/interface/user.interface'
import { UserGetDto } from '@module/user/dto/user.dto'
import { Me } from '@auth/interface/intra.interface'
import { NotFoundException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'

export class UserRepository {
    constructor(private prisma: PrismaService) {}

    SortUserByWinLose(a, b): number {
        const winLoseA: number = a.total_wins - a.total_loses
        const winLoseB: number = b.total_wins - b.total_loses
        return winLoseB - winLoseA
    }

    async SortUserByWinGap(): Promise<UserGetDto[]> {
        const users: UserGetDto[] = await this.prisma.user.findMany()
        const sortedUsers: UserGetDto[] = users.sort(this.SortUserByWinLose)
        return sortedUsers
    }

    CreateUserObject(data: Me): NewUser {
        const user: NewUser = {
            login: data.login,
            username: data.login,
            first_name: data.first_name,
            last_name: data.last_name,
            image: data.image.link,
            email: data.email,
            status: UserStatus.ONLINE,
            xp: 0,
            ladder: 6,
        }
        return user
    }

    async deleteUser(name: string): Promise<UserGetDto> {
        const user = await this.prisma.user.findUnique({ where: { login: name } })
        if (!user) {
            throw new NotFoundException(`User with name ${name} was not found`)
        }
        return await this.prisma.user.delete({ where: { login: name } })
    }
}
