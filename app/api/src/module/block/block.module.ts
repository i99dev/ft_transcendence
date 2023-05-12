import { Module } from "@nestjs/common";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { PrismaService } from "@providers/prisma/prisma.service";
import { FriendWsService } from "@module/friend/gateway/friendWs.service";
import { FriendService } from "@module/friend/friend.service";
import { PrismaClient } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { FriendRepository } from "@module/friend/repository/friend.repository";


@Module({
    imports: [],
    controllers: [BlockController],
    providers: [BlockService, PrismaService, FriendWsService, FriendService, PrismaClient, JwtService, FriendRepository],
    exports: []
})
export class BlockModule {}