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

    it('/users/:user/friend/:friend (Patch)', () => {
        return request(app.getHttpServer())
            .patch('/users/isaad/friend/oal-tena')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })

    it('/users/:user/friend/:friend (Patch)', () => {
        return request(app.getHttpServer())
            .delete('/users/isaad/friend/oal-tena')
            .expect(200)
            .expect(res => {
                expect(res.body.IsNotEmpty)
            })
    })
})
