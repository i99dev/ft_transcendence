import { UserGetDto, UserPatchDto } from './dto/user.dto';
import { PrismaClient, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { Me } from '../../auth/interfaces/intra.interface';

@Injectable({})
export class UserService {
  prisma = new PrismaClient();
  repository = new UserRepository();

  async getUser(name: string): Promise<UserGetDto> {
    const user: UserGetDto = await this.prisma.user.findUnique({
      where: { login: name },
      include: {
        friend_to: true,
        friends: true,
      },
    });
    return user;
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

  async getUserForPatch(name: string): Promise<UserGetDto> {
    const user: UserGetDto = await this.prisma.user.findUnique({
      where: { login: name },
    });
    return user;
  }

  async updateUser(data: User): Promise<User> {
    return await this.prisma.user.update({
      where: { login: data.login },
      data,
    });
  }

  async CreateUser(intraUser: Me) {
    return await this.prisma.user.create({
      data: await this.repository.CreateUserObject(intraUser),
    });
  }

  async SortMany(orderBy: object): Promise<UserGetDto[]> {
    if (orderBy == null) orderBy = { id: 'asc' };
    const sortedUsers: UserGetDto[] = await this.prisma.user.findMany({
      orderBy: orderBy,
      include: {
        friend_to: true,
        friends: true,
      },
    });
    return sortedUsers;
  }

  async getFriends(login: string): Promise<UserGetDto[]> {
    const user: UserGetDto = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
      include: {
        friends: true,
        friend_to: true,
      },
    });
    const commonFriends: UserGetDto[] = user.friend_to.filter((friend) =>
      user.friends.some((f) => f.id === friend.id),
    );
    return commonFriends;
  }

  async DeleteFriendOrUser(
    login: UserPatchDto,
    name: string,
  ): Promise<UserGetDto> {
    if (login.friends) return this.repository.deleteFriend(name, login.friends);
    else {
      return this.repository.deleteUser(name);
    }
  }

  async CheckFriendsUpdate(data: UserPatchDto, name: string) {
    if (data.friends) {
      await this.UpdateUserFriends(name, data.friends);
    }
    return data;
  }
}
