import { Module } from "@nestjs/common";
import { MulterController } from "./multer.controller";
import { MulterService } from "./multer.service";
import { PrismaService } from "@providers/prisma/prisma.service";


@Module({
    imports: [],
    controllers: [MulterController],
    providers: [MulterService, PrismaService],
})
export class MulterModule {}