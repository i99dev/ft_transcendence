import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { CreateNotificationDto } from '@common/dtos/notification.dto'
import { NotificationType } from '@prisma/client'

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async createNotification(payload: CreateNotificationDto) {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    user_login: payload.user_login,
                    content: payload.content,
                    type: payload.type,
                    target: payload?.target,
                },
            })
            return notification
        } catch (error) {
            console.log(error)
        }
    }

    async deleteNotification(id: number, user_login: string) {
        try {
            const notification = await this.prisma.notification.deleteMany({
                where: {
                    id: id,
                    user_login: user_login,
                },
            })
            return notification
        } catch (error) {
            console.log(error)
        }
    }

    async getMyNotifications(user_login: string, page: number) {
        try {
            if (!page) page = 1
            const notifications = await this.prisma.notification.findMany({
                where: {
                    user_login: user_login,
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip: (page - 1) * 20,
                take: 20,
            })
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    async getMyNotificationsByType(user_login: string, type: NotificationType) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    user_login: user_login,
                    type: type,
                },
            })
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    setUpNotificationMessage(socket: Socket, message) {
        socket.emit('notification', message)
    }
}
