import { UserModule } from '../../../../src/modules/user/user.module';
import { Test, TestingModule } from '@nestjs/testing';
import { Body, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.IsNotEmpty);
      });
  });

  it('/api/users/:name (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users/isaad')
      .expect(200)
      .expect((res) => {
        expect(res.body.IsNotEmpty);
      });
  });

  it('/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users?sort=total_wins&order=desc')
      .expect(200)
      .expect((res) => {
        expect(res.body.IsNotEmpty);
      });
  });

  const data: any = {
    first_name: 'Imad',
    last_name: 'Saad',
  };

  it('/api/users/:name (Patch)', () => {
    return request(app.getHttpServer())
      .patch('/api/users/isaad', data)
      .expect(200)
      .expect((res) => {
        expect(res.body.IsNotEmpty);
      });
  });
});
