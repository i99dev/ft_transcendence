
import { PrismaClient } from '@prisma/client'
import { UserSeeder } from './seeders/user/user.seeder'
import { FriendSeeder } from './seeders/friend/friend.seeder'
import { PowerUpSeeder } from './seeders/power_up/power_up.seeder'
import { AchievementSeeder } from './seeders/achievement/achievement.seeder'
import { GroupChatSeeder } from './seeders/groupChat/groupChat.seeder'
import { ChatUserSeeder } from './seeders/chatUser/chatUser.seeder'
import { MessageSeeder } from './seeders/message/message.seeder'
import { DirectChatSeeder } from './seeders/directChat/directChat.seeder'
import { ChatRoomSeeder } from './seeders/chatRoom/chat_room.seeder'
import { MatchSeeder } from './seeders/match/match.seeder'
import { NotificationSeeder } from './seeders/notification/notification.seeder'
import { BlockSeeder } from './seeders/block/block.seed'

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
    // Create MatchHistory
    const matchHistory = await new MatchSeeder().seedMatchHistory()
    const getAchievements = await new NotificationSeeder().seedNotifications()
    const getBlocks = await new BlockSeeder().seedBlock()
    console.log({
        users,
        powerUps,
        achievements,
        updateUsers,
        matchHistory,
        getAchievements,
        getBlocks,
    })
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
