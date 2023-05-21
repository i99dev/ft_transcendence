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

    async getMyNotifications(user_login: string) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    user_login: user_login,
                },
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

    getType(type: string) {
        switch (type) {
            case 'ACHIEVEMENT':
                return NotificationType.ACHIEVEMENT
            case 'FRIEND_REQUEST':
                return NotificationType.FRIEND_REQUEST
            case 'FRIEND_REQUEST_ACCEPTED':
                return NotificationType.FRIEND_REQUEST_ACCEPTED
            case 'MATCH_INVITE':
                return NotificationType.MATCH_INVITE
            case 'CHAT_INVITE':
                return NotificationType.CHAT_INVITE
            case 'RANK_UP':
                return NotificationType.RANK_UP
            case 'RANK_DOWN':
                return NotificationType.RANK_DOWN
        }
    }

    setUpNotificationMessage(socket: Socket, message) {
        socket.emit('notification', message)
    }
}
