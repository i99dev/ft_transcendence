import { Module } from '@nestjs/common'
import { MulterController } from './multer.controller'
import { MulterService } from './multer.service'
import { PrismaService } from '@providers/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'

@Module({
    imports: [],
    controllers: [MulterController],
    providers: [MulterService, PrismaService, ConfigService],
})
export class MulterModule {}
