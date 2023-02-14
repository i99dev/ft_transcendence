import { AchievementService } from './achievement.service'
import { Controller } from '@nestjs/common'

@Controller('/api/users')
export class AchievementController {
    constructor(private readonly AchievementService: AchievementService) {}
}
