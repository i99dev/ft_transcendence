import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { CreateNotificationDto } from '@common/dtos/notification.dto'

@Injectable()
export class NotificationService {
    private prisma = new PrismaService()

    async createNotification(payload: CreateNotificationDto) {
        console.log(payload)
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
            console.log('error---->', error)
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

    setUpNotificationMessage(socket: Socket, message) {
        socket.emit('notification', message)
    }
}
