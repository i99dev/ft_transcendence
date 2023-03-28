
import { object } from '@hapi/joi';
import { PrismaService } from '@providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
}