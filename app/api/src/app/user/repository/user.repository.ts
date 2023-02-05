import { PrismaClient } from '@prisma/client';

export class UserRepository {
  prisma = new PrismaClient();

	SortUserByWinLose(a, b) {
		const winLoseA = a.total_wins - a.total_loses;
		const winLoseB = b.total_wins - b.total_loses;
		return winLoseB - winLoseA;
	}	

	async SortUserByWinGap() {
		const users = await this.prisma.user.findMany();
		const sortedUsers = users.sort(this.SortUserByWinLose);
		return sortedUsers;
	}
}