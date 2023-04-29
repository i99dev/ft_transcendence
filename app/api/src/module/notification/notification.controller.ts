import { Get, Param, Query, Delete, Logger } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { NotificationService } from './notification.service'

@Controller('/Notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getMyNotifications(@Req() req) {
        return await this.notificationService.getMyNotifications(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteNotification(@Param('id') id: string, @Req() req) {
        const idNumber = parseInt(id)
        return await this.notificationService.deleteNotification(idNumber, req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/achievement')
    async deleteAchievNotification(@Query('content') content: string, @Req() req) {
        console.log('delete Notification')
        return await this.notificationService.deleteAchievNotification(req.user.login, content)
    }
}
