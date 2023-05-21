import { Get, Param, Delete, NotFoundException } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { NotificationService } from './notification.service'
import { PosNumberPipe } from '@common/pipes/posNumber.pipe'
import { ParseStringPipe } from '@common/pipes/string.pipe'

@Controller('/Notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getMyNotifications(@Req() req) {
        const notif = await this.notificationService.getMyNotifications(req.user.login)
        if (!notif) return new NotFoundException('No notifications found')
        return notif
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me/:type')
    async getMyNotificationsByType(@Req() req, @Param('type', ParseStringPipe) type: string) {
        const notif = await this.notificationService.getMyNotificationsByType(
            req.user.login,
            this.notificationService.getType(type),
        )
        if (!notif) return new NotFoundException('No notifications found')
        return notif
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteNotification(@Param('id', PosNumberPipe) id: string, @Req() req) {
        const idNumber = parseInt(id)
        const notif = await this.notificationService.deleteNotification(idNumber, req.user.login)
        if (!notif) return new NotFoundException('No notifications found')
        return notif
    }
}
