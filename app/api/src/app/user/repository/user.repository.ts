import { PrismaClient } from '@prisma/client';
import { UserGetDto } from '../dto/user.dto';

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
}