import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/perfomance.interceptors'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true })
    app.setGlobalPrefix('api')
    app.use(cookieParser())
    app.useGlobalInterceptors(new LoggingInterceptor())
    const configService = app.get(ConfigService)
    const config = new DocumentBuilder()
        .setTitle('Transcendence')
        .setDescription('The transcendence API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
    await app.listen(configService.get<number>('app.port', 8000))
}
bootstrap()
