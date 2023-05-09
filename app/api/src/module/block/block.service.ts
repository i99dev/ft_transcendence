import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma/prisma.service";


@Injectable()
export class BlockService {
    constructor(private prisma: PrismaService) {}
}