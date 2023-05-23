import { UserStatus } from '@prisma/client'
import { NewUser } from '@module/user/interface/user.interface'
import { Me } from '@auth/interface/intra.interface'
import { PrismaService } from '@providers/prisma/prisma.service'

export class UserRepository {
    constructor(private prisma: PrismaService) {}

    SortUserByWinLose(a, b): number {
        const winLoseA: number = a.total_wins - a.total_loses
        const winLoseB: number = b.total_wins - b.total_loses
        return winLoseB - winLoseA
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
}
