import { User } from '../../../src/auth/interface/intra.interface';
import {
  UserPatchDto,
  UserGetDto,
} from './../../../src/module/user/dto/user.dto';
import { UserService } from './../../../src/module/user/user.service';

describe('CheckFriendsUpdate', () => {
  let appService: UserService;

  //   beforeEach(() => {
  appService = new UserService();
  //   });

  it('should update friends list', async () => {
    const data: UserPatchDto = {
      friends: 'oal-tena',
    };
    const name = 'isaad';
    const response = await appService.CheckFriendsUpdate(data, name);
    expect(response).toBeTruthy();
  });

  it('should delete a friend', async () => {
    const data: UserPatchDto = {
      friends: 'oal-tena',
    };
    const name = 'isaad';
    const response = await appService.DeleteFriendOrUser(data, name);
    expect(response).toBeTruthy();
  });

  it('should return common friends', async () => {
    const name = 'isaad';
    const response = await appService.getFriends(name);
    expect(response).toBeTruthy();
  });

  it('should return sorted users', async () => {
    const orderBy: object = { total_wins: 'asc' };
    const response = await appService.SortMany(orderBy);
    expect(response).toBeTruthy();
  });

  it('should update one user', async () => {
    const user: UserGetDto = {
      id: 99,
      login: 'isaad',
      username: 'IS',
      status: 'LIVE',
      first_name: 'Imad',
      last_name: 'Saad',
      email: 'isaad@student.42abudhabi.ae',
      created_at: new Date(),
      last_login: new Date(),
      image:
        'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg',
      total_wins: 9,
      total_loses: 1,
      exp_level: 0,
      points: 0,
      two_fac_auth: false,
    };
    const response = await appService.updateUser(user);
    expect(response).toBeTruthy();
  });

  it('should return one user', async () => {
    const user: string = 'isaad';
    const response = await appService.getUserForPatch(user);
    expect(response).toBeTruthy();
  });

  it('should return one user with friends', async () => {
    const user: string = 'isaad';
    const response = await appService.getUser(user);
    expect(response).toBeTruthy();
  });
});
