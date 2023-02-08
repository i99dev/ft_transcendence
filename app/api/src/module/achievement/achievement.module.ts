import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [AchievementController],
    providers: [AchievementService],
})
export class UserModule {}