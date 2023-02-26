import { UserModule } from '../../../../src/module/user/user.module'
import { Test, TestingModule } from '@nestjs/testing'
import { Body, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../../src/app.module'

describe('UserController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, UserModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })

    it('/users/:name (GET)', () => {
        return request(app.getHttpServer())
            .get('/users/isaad')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users?sort=total_wins&order=desc')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })

    it('/users/:name (Patch)', () => {
        const data: any = {
            first_name: 'obaid',
            last_name: 'altenaiji',
        }
        return request(app.getHttpServer())
            .patch('/users/oal-tena', data)
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })
})
