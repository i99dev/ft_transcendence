import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable()
export class MulterService {
    constructor(private prisma: PrismaService) {}

    async checkTargetId(targetId: string, user_login: string) {
        try {
            let target = null
            if (targetId === user_login) {
                target = await this.prisma.user.findUnique({
                    where: {
                        login: targetId,
                    },
                })
            }
            if (!target) {
                target = await this.prisma.groupChat.findUnique({
                    where: {
                        chat_room_id: targetId,
                    },
                })
            }
            if (target) return target
            return null
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateTargetAvatar(targetId: string, avatar: string) {
        try {
            let target = null
            target = await this.prisma.user.update({
                where: {
                    login: targetId,
                },
                data: {
                    image: avatar,
                },
            })
            if (!target) {
                target = await this.prisma.groupChat.update({
                    where: {
                        chat_room_id: targetId,
                    },
                    data: {
                        image: avatar,
                    },
                })
            }
            if (target) return target
            return null
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
