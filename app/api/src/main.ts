import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/perfomance.interceptors'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.useGlobalInterceptors(new LoggingInterceptor())
    const configService = app.get(ConfigService)
    await app.listen(configService.get<number>('app.port', 8000))
}
bootstrap()
