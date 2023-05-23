import { Module } from '@nestjs/common'
import { MulterController } from './multer.controller'
import { MulterService } from './multer.service'
import { ConfigService } from '@nestjs/config'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [MulterController],
    providers: [MulterService, ConfigService],
    exports: [MulterService],
})
export class MulterModule {}
