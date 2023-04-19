import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma/prisma.service";


@Injectable()
export class MulterService {
    constructor(private prisma: PrismaService) {}
}