import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';


@Injectable()
export class FriendSeeder {
  private prisma = new PrismaClient();
  private users: User[];

  async assignFriendsToUsers() : Promise<User[]> {
    this.users = [
      await this.prisma.user.update({
        where: { login: "bnaji" },
        data: {
          friends: {
            connect: [{ login: 'isaad' }, { login: 'oal-tena' }],
          },
        },
      }),
      await this.prisma.user.update({
        where: { login: "isaad" },
        data: {
          friends: {
            connect: [{ login: 'isaad' }]
          },
        },
      }),
      await this.prisma.user.update({
        where: { login: "aaljaber" },
        data: {
          friends: {
            connect: [{ login: 'mal-guna' }, { login: 'oal-tena' }],
          },
        },
      }),
      await this.prisma.user.update({
        where: { login: "mal-guna" },
        data: {
          friends: {
            connect: [{ login: 'mal-guna' }, { login: 'oal-tena' }],
          },
        },
      }),
      await this.prisma.user.update({
        where: { login: "oal-tena" },
        data: {
          friends: {
            connect: [{ login: 'isaad' }, { login: 'mal-guna' },
                    { login: 'bnaji' }, { login: 'aaljaber' },
                    { login: 'oal-tena' },
            ],
          },
        },
      }),
    ];
    return this.users;
  }
}
