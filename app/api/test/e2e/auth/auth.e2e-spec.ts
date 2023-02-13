import { AuthModule } from '../../../src/auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { Body, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { FtAuthGuard } from '../../../src/common/guards/ft.auth.gaurd';
import { FtStrategy } from '../../../src/auth/strategy/ft.strategy';
import { AuthService } from '../../../src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPostDto } from '../../../src/auth/dto/auth.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  const intraUser = {
    login: 'bnaji',
    first_name: 'bassam',
    last_name: 'naji',
    email: 'bnaji@student.42abudhabi.ae',
    image: {
      link: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
    },
  };
  var data: AuthPostDto = {
    code: 'auth_code',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideGuard(FtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation((req) => {
          req.user = intraUser;
          return req.user;
        }),
      })
      .compile();

    const userMiddleware = (req, res, next) => {
      req.user = intraUser;
      next();
    };

    app = moduleFixture.createNestApplication();
    app.use(userMiddleware);
    authService = moduleFixture.get<AuthService>(AuthService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  describe('/auth', () => {
    it('check if returns acess token', () => {
      return request(app.getHttpServer())
        .post('/auth')
        .send(data)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          const decoded = jwtService.verify(res.body.access_token, {
            secret: configService.get<string>('JWT_SECRET', 'jwt_secret'),
          });

          expect(decoded.login).toBe(intraUser.login);
        });
    });
  });
});
