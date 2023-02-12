import { PrismaClient, UserStatus } from '@prisma/client';

import { NewUser } from './../../../module/user/interface/user.interface';
import { UserGetDto } from './../../../module/user/dto/user.dto';
import { Me } from '../../../auth/interface/intra.interface';

export class UserRepository {
  prisma = new PrismaClient();

  SortUserByWinLose(a, b): number {
    const winLoseA: number = a.total_wins - a.total_loses;
    const winLoseB: number = b.total_wins - b.total_loses;
    return winLoseB - winLoseA;
  }

  async SortUserByWinGap(): Promise<UserGetDto[]> {
    const users: UserGetDto[] = await this.prisma.user.findMany();
    const sortedUsers: UserGetDto[] = users.sort(this.SortUserByWinLose);
    return sortedUsers;
  }

  CreateUserObject(data: Me): NewUser {
    let user: NewUser = {
      login: data.login,
      username: data.login,
      first_name: data.first_name,
      last_name: data.last_name,
      image: data.image.link,
      email: data.email,
      status: UserStatus.ONLINE,
    };
    return user;
  }
  async deleteUser(name: string): Promise<UserGetDto> {
    return await this.prisma.user.delete({ where: { login: name } });
  }

  async deleteFriend(name: string, login: string): Promise<UserGetDto> {
    return await this.prisma.user.update({
      where: { login: name },
      include: {
        friend_to: true,
        friends: true,
      },
      data: { friends: { disconnect: { login: login } } },
    });
  }

  async UpdateUserFriends(name: string, toAdd: string): Promise<UserGetDto> {
    let user2: UserGetDto = await this.prisma.user.findUnique({
      where: { login: toAdd },
    });
    let user: UserGetDto = await this.prisma.user.update({
      where: { login: name },
      include: {
        friend_to: true,
        friends: true,
      },
      data: { friends: { connect: [{ id: user2.id }] } },
    });
    return user;
  }
}
