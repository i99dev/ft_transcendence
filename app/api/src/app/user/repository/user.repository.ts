import { PrismaClient, UserStatus } from '@prisma/client';
import { Me } from '../../../auth/interfaces/intra.interface';
import { NewUser } from '../interface/user.interface';

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

	CreateUserObject(data: Me): NewUser {
    let user: NewUser = {
      login: data.login,
      username: data.login,
      first_name: data.first_name,
      last_name: data.last_name,
      image: data.image.link,
      email: data.email,
			status: UserStatus.ONLINE
    }
    return user;
  }
}