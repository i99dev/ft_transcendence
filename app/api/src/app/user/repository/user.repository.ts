import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  prisma = new PrismaClient();

	async SortMany(orderBy: object){
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: orderBy
		});
		return sortedUsers;
	}
}