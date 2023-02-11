import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { UserGetDto } from '../../../src/module/user/dto/user.dto';
import { UserModule } from '../../../src/module/user/user.module';
import { UserService } from '../../../src/module/user/user.service';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import axios from 'axios';
import { FtAuthGuard } from '../../../src/common/guards/ft.auth.gaurd';
import { AuthRepository } from '../../../src/auth/repository/auth.repository';

describe('AuthService', () => {
  let app: INestApplication;
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  const myUser: UserGetDto = {
    id: 1,
    login: 'bnaji',
    username: 'bnaji',
    status: 'LIVE',
    first_name: 'bassam',
    last_name: 'naji',
    email: 'bnaji@student.42abudhabi.ae',
    created_at: new Date(),
    last_login: new Date(),
    image:
      'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
    total_wins: 9,
    total_loses: 1,
    exp_level: 0,
    points: 0,
    two_fac_auth: false,
  };
  const intraUser = {
    login: 'bnaji',
    first_name: 'bassam',
    last_name: 'naji',
    email: 'bnaji@student.42abudhabi.ae',
    image: {
      link: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
    },
  };
  const testUser = {
    login: 'test',
    first_name: 'test',
    last_name: 'test',
    email: 'test@student.42abudhabi.ae',
    image: {
      link: 'test.jpg',
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule,
        UserModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET', 'jwt_secret'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
            },
          }),
        }),
      ],
      providers: [AuthService, AuthRepository],
    })
      .overrideProvider(FtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation((req) => {
          req.user = intraUser;
          return req.user;
        }),
      })
      .compile();

    app = moduleRef.createNestApplication();
    authService = moduleRef.get<AuthService>(AuthService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    await app.init();
  });

  describe('getJwt', () => {
    it('should return jwt token', async () => {
      const token = await authService.getJwt(myUser);
      const decoded = jwtService.verify(token, {
        secret: configService.get<string>('JWT_SECRET', 'jwt_secret'),
      });

      expect(authService.getJwt).toBeDefined();
      expect(decoded.id).toBe(myUser.id);
      expect(decoded.login).toBe(myUser.login);
    });
  });

  describe('checkUserAccountOnDb', () => {
    it('should return user object from database with HttpStataus CREATED', async () => {
      // Create user account if not existed
      const { httpStatus, user } = await authService.checkUserAccountOnDb(
        testUser,
      );

      // Delete the user account after storing the result
      return request(app.getHttpServer())
        .delete('/users/test')
        .then(() => {
          // Check if user was created
          expect(httpStatus).toBe(HttpStatus.CREATED);
          expect(user.login).toBe(user.login);
        });
    });

    it('should return user object from database with HttpStataus OK', async () => {
      const { httpStatus, user } = await authService.checkUserAccountOnDb(
        intraUser,
      );

      expect(httpStatus).toBe(HttpStatus.OK);
      expect(user.login).toBe(user.login);
    });
  });

  // describe('getIntraAccessToken', () => {
  //   it('should return token', async () => {
  //       const code: string = 'auth_code';
  //       const respons = {
  //         data: {
  //           access_token: 'intra_access_token'
  //         }
  //       };

  //       // console.log(respons.data.access_token);
  //       const mockGet = jest.spyOn(axios, 'post');
  //       mockGet.mockReturnValueOnce(Promise.resolve(respons));
  //       // jest.spyOn(axios, 'get').mockImplementation(Promise.resolve(response));

  //       expect(await authService.getIntraAccessToken(code)).toBeDefined()

  //       // expect(res).toBe(HttpStatus.CREATED)
  //       // expect(user.login).toBe(user.login)
  //   });
  // });
});
