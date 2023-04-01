// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client'
import { create } from 'domain'
import { UserSeeder } from './seeders/user/user.seeder'
import { FriendSeeder } from './seeders/friend/friend.seeder'
import { PowerUpSeeder } from './seeders/power_up/power_up.seeder'
import { AchievementSeeder } from './seeders/achievement/achievement.seeder'
import { MatchHistorySeeder } from './seeders/match-history/match-history.seeder'
// import { SeederService   } from './seeders/user/user.seeder.service';

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
    // Create Users
    const users = await new UserSeeder().seedUsers()

    // Assign Friends
    await new FriendSeeder().assignFriendsToUsers()

    // Create powerUp
    const powerUps = await new PowerUpSeeder().seedPowerUps()

    // Assign Powerup
    await new PowerUpSeeder().assignPowerUpsToUsers()

    // Create Achievements
    const achievements = await new AchievementSeeder().seedAchievements()

    // Assign Achievements
    const updateUsers = await new AchievementSeeder().assignAchievementsToUsers()

    // Create MatchHistory
    const matchHistory = await new MatchHistorySeeder().seedMatchHistory()

    console.log({ users, powerUps, achievements, updateUsers, matchHistory })
}

// execute the main function
main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect()
    })
