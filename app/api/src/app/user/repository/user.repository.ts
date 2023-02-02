import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  prisma = new PrismaClient();

  async sortUserById() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['token', 'id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				id: 'asc'
			}
		});
		return sortedUsers;
	}
}