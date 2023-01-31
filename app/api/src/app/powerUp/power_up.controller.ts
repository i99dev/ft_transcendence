import { PowerUpService } from './power_up.service';
import { Controller } from '@nestjs/common';

@Controller('/api/users')
export class PowerUpController {
  constructor(private readonly PowerUpService: PowerUpService) {}
}
