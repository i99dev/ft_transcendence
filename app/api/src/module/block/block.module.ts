import { Module } from "@nestjs/common";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { PrismaService } from "@providers/prisma/prisma.service";


@Module({
    imports: [],
    controllers: [BlockController],
    providers: [BlockService, PrismaService],
    exports: []
})
export class BlockModule {}