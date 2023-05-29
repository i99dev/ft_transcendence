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
                    username: 'BN',
                    email: 'bnaji@student.42abudhabi.ae',
                    status: 'ONLINE',
                    first_name: 'Bassam',
                    last_name: 'Naji',
                    image: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
                    xp: 2000,
                    ladder: 3,
                    wr: 0.5,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'isaad' },
                update: {},
                create: {
                    login: 'isaad',
                    username: 'IS',
                    email: 'isaad@student.42abudhabi.ae',
                    first_name: 'Imad',
                    last_name: 'Saad',
                    status: 'OFFLINE',
                    image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg',
                    xp: 700,
                    ladder: 4,
                    wr: 0,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'aaljaber' },
                update: {},
                create: {
                    login: 'aaljaber',
                    username: 'AJ',
                    email: 'aaljaber@student.42abudhabi.ae',
                    first_name: 'Abrar',
                    last_name: 'Aljaberi',
                    status: 'OFFLINE',
                    image: 'https://cdn.intra.42.fr/users/e0b789be87c05be51ec0a8ea161a20af/aaljaber.jpg',
                    xp: 4000,
                    ladder: 2,
                    wr: 1,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'mal-guna' },
                update: {},
                create: {
                    login: 'mal-guna',
                    username: 'MA',
                    email: 'mal-guna@student.42abudhabi.ae',
                    first_name: 'Moatasem',
                    last_name: 'Al Gunaid',
                    status: 'OFFLINE',
                    image: 'https://cdn.intra.42.fr/users/0799c94954ead5be4dec31c1516bf6c7/mal-guna.jpg',
                    xp: 2500,
                    ladder: 3,
                    wr: 0.33,
                },
            }),
            await this.prisma.user.upsert({
                where: { login: 'oal-tena' },
                update: {},
                create: {
                    login: 'oal-tena',
                    username: 'OA',
                    email: 'oal-tena@student.42abudhabi.ae',
                    first_name: 'Obaid',
                    last_name: 'Al Tenaiji',
                    status: 'OFFLINE',
                    image: 'https://cdn.intra.42.fr/users/12ebc19c2030866129ff5d1931695f4f/oal-tena.jpg',
                    xp: 6590,
                    ladder: 1,
                    wr: 0.5,
                },
            }),
        ]
        return this.users
    }
}
