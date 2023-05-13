import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import * as fs from 'fs'

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
            return await this.prisma.user.update({
                where: {
                    login: targetId,
                },
                data: {
                    image: avatar,
                },
            })
        } catch (error) {
            try {
                return await this.prisma.groupChat.update({
                    where: {
                        chat_room_id: targetId,
                    },
                    data: {
                        image: avatar,
                    },
                })
            } catch (error) {
                console.log(error)
                return undefined
            }
        }
    }

    createAndDeleteExtraFiles(userDir: string) {
        if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads')
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir)
        } else {
            const files = fs.readdirSync(userDir)
            for (const file of files) {
                fs.unlinkSync(`${userDir}/${file}`)
            }
        }
    }
}
