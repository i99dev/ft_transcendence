import { PowerUpService } from './power_up.service';
import { PowerUpController } from './power_up.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PowerUpController],
  providers: [PowerUpService],
})
export class PowerUpModule {}
