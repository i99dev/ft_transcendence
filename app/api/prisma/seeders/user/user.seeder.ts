import { Injectable } from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'

@Injectable()
export class UserSeeder {
    private prisma = new PrismaClient()
    private users: User[]

    async seedUsers(): Promise<User[]> {
        this.users = [
            await this.prisma.user.upsert({
                where: { login: 'bnaji' },
                update: {},
                create: {
                    login: 'bnaji',
                    username: 'bnaji',
                    email: 'bnaji@student.42abudhabi.ae',
                    status: 'ONLINE',
                    first_name: 'Bassam',
                    last_name: 'Naji',
                    image: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
                    xp: 2000,
                    ladder: 3,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'isaad' },
                update: {},
                create: {
                    login: 'isaad',
                    username: 'isaad',
                    email: 'isaad@student.42abudhabi.ae',
                    first_name: 'Imad',
                    last_name: 'Saad',
                    status: 'LIVE',
                    image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg',
                    xp: 700,
                    ladder: 4,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'aaljaber' },
                update: {},
                create: {
                    login: 'aaljaber',
                    username: 'aaljaber',
                    email: 'aaljaber@student.42abudhabi.ae',
                    first_name: 'Abrar',
                    last_name: 'Aljaberi',
                    status: 'LIVE',
                    image: 'https://cdn.intra.42.fr/users/e0b789be87c05be51ec0a8ea161a20af/aaljaber.jpg',
                    xp: 4000,
                    ladder: 2,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'mal-guna' },
                update: {},
                create: {
                    login: 'mal-guna',
                    username: 'mal-guna',
                    email: 'mal-guna@student.42abudhabi.ae',
                    first_name: 'Moatasem',
                    last_name: 'Al Gunaid',
                    status: 'LIVE',
                    image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/mal-guna.jpg',
                    xp: 2500,
                    ladder: 3,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'oal-tena' },
                update: {},
                create: {
                    login: 'oal-tena',
                    username: 'oal-tena',
                    email: 'oal-tena@student.42abudhabi.ae',
                    first_name: 'Obaid',
                    last_name: 'Al Tenaiji',
                    status: 'LIVE',
                    image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/oal-tena.jpg',
                    xp: 6590,
                    ladder: 1,
                },
            }),
        ]
        return this.users
    }
}
