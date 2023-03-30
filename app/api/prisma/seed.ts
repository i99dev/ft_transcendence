// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client'
import { create } from 'domain'
import { UserSeeder } from './seeders/user/user.seeder'
import { FriendSeeder } from './seeders/friend/friend.seeder'
import { PowerUpSeeder } from './seeders/power_up/power_up.seeder'
import { AchievementSeeder } from './seeders/achievement/achievement.seeder'
import { GroupChatSeeder } from './seeders/chat/chat.seeder'
import { ChatUserSeeder } from './seeders/chat_user/chat_user.seeder'
import { MessageSeeder } from './seeders/message/message.seeder'
import { DirectChatSeeder } from './seeders/direct_chat/direct_chat.seeder'
import { ChatRoomSeeder } from './seeders/chatRoom/chat_room.seeder'
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

    // Create ChatRooms
    const chatRooms = await new ChatRoomSeeder().seedChatRooms()
    
    // Create DirectChatRooms
    const directChats = await new DirectChatSeeder().seedDirectChats()

    //
    const groupChats = await new GroupChatSeeder().seedGroupChats()

    // Create ChatRoomUsers
    await new ChatUserSeeder().assignUsersToChats()

    // Assign Messages to ChatRooms and Users
    await new MessageSeeder().assignMessagesToChats()

    console.log({ users, powerUps, achievements, updateUsers, groupChats, directChats, chatRooms })
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
