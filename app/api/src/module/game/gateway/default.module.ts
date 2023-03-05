import { Module } from '@nestjs/common';
import { DefaultGateway } from './default.gateway';
import { DefaultService } from './default.service';

@Module({
    providers: [DefaultGateway, DefaultService],
})
export class DefaultModule {}
