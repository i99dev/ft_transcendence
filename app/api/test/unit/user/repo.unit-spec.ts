import { UserRepository } from './../../../src/app/user/repository/user.repository';
import { User } from '@prisma/client';
import { UserPatchDto } from './../../../src/app/user/dto/user.dto';
import { UserService } from './../../../src/app/user/user.service';

describe('Check repo', () => {
  let appService: UserRepository;

    appService = new UserRepository();

  it('should get win difference', async () => {
    const user1: UserPatchDto = {
      total_wins: 5,
      total_loses: 5
    };
    const user2: UserPatchDto = {
      total_wins: 5,
      total_loses: 5
    };
    const response = appService.SortUserByWinLose(user1, user2);
    expect(response).toEqual(0);
  });

  it('should sort users', async () => {
    const response = await appService.SortUserByWinGap();
    expect(response).toBeTruthy();
  });

  it('should add friend', async () => {
    const response = await appService.UpdateUserFriends('isaad', 'oal-tena');
    expect(response).toBeTruthy();
  });

  it('should delete friend', async () => {
    const response = await appService.deleteFriend('isaad', 'oal-tena');
    expect(response).toBeTruthy();
  });

});
