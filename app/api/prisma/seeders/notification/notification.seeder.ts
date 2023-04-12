import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class NotificationSeeder {
    private prisma = new PrismaClient();

    async seedNotifications() {
        await this.prisma.notification.upsert({
            where: { id: 1 },
            update: {},
            create: {
                user_login: 'bnaji',
                content: 'mal-guna sent you a friend request',
                type: 'FRIEND_REQUEST',
                target: 'mal-guna',
            }
        });
        await this.prisma.notification.upsert({
            where: { id: 2 },
            update: {},
            create: {
                user_login: 'isaad',
                content: 'acquired a new achievement: Skull Crusher',
                type: 'ACHIEVEMENT'
            },
        });
        await this.prisma.notification.upsert({
            where: { id: 3 },
            update: {},
            create: {
                user_login: 'mal-guna',
                content: 'bnaji accepted your friend request',
                type: 'FRIEND_REQUEST_ACCEPTED'
            }
        });
        await this.prisma.notification.upsert({
            where: { id: 4 },
            update: {},
            create: {
                user_login: 'aaljaber',
                content: 'oal-tena sent you a challenge',
                type: 'MATCH_INVITE',
                target: 'oal-tena'
            }
        });
        await this.prisma.notification.upsert({
            where: { id: 5 },
            update: {},
            create: {
                user_login: 'oal-tena',
                content: 'isaad invited you to a group chat',
                type: 'CHAT_INVITE',
                target: 'ROOM_ID'
            }
        });
    }
}