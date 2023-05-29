import { PrismaService } from '@providers/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService],
    exports: [NotificationService],
})
export class NotificationModule {}
