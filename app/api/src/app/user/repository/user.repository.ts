import { PrismaClient, User } from '@prisma/client';
import { UserGetDto } from '../dto/user.dto';

export class UserRepository {
  prisma = new PrismaClient();

	async SortMany(orderBy: object){
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: orderBy
		});
		return sortedUsers;
	}

	async sortUserBy(): Promise<any> {
		const sortedUsers = await this.SortMany({
			id: 'asc'
		});
		return sortedUsers;
	}

	async SortUserByWins() {
		const sortedUsers = await this.SortMany({
				total_wins: 'desc'
		});
		return sortedUsers;
	}

	async SortUserByXP() {
		const sortedUsers = await this.SortMany({
			exp_level: 'desc'
		});
		return sortedUsers;
	}

	async SortUserByLoses() {
		const sortedUsers = await this.SortMany({
			total_loses: 'desc'
		});
		return sortedUsers;
	}

	SortUserByWinLose(a, b) {
		const winLoseA = a.total_wins - a.total_loses;
		const winLoseB = b.total_wins - b.total_loses;
		return winLoseB - winLoseA;
	}	

	async SortUserByWinGap() {
		const users = await this.prisma.user.findMany();
		const sortedUsers = users.sort(this.SortUserByWinLose);
		for (let i = 0; i < sortedUsers.length; i++) {
			delete sortedUsers[i].token;
		}
		return sortedUsers;
	}
}