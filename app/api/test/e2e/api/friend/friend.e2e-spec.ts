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

    it('/users/:user/friends/:friend (Post)', () => {
        return request(app.getHttpServer())
            .post('/users/bnaji/friends/aaljaber')
            .expect(201)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })

    it('/users/:user/friends/:friend (delete)', () => {
        return request(app.getHttpServer())
            .delete('/users/isaad/friends/bnaji')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })
})
