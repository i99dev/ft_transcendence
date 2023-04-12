import { Get, Param, Query } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { NotificationService } from './notification.service'

@Controller('/Notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    getMyNotifications(@Req() req) {
        return this.notificationService.getMyNotifications(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/delete/:id')
    deleteNotification(@Param('id') id: string, @Req() req) {
        const idNumber = parseInt(id)
        return this.notificationService.deleteNotification(idNumber, req.user.login)
    }
}