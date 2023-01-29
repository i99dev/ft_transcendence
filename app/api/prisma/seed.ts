// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  const user1 = await prisma.user.upsert({
    where: { login: 'bnaji' },
    update: {},
    create: {
      login: 'bnaji',
      email: 'bnaji@student.42abudhabi.ae',
      status: 'ONLINE',
      first_name: 'Bassam',
      last_name: 'Naji',
      image: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg'
    },
  });

  const user2 = await prisma.user.upsert({
    where: { login: 'isaad' },
    update: {},
    create: {
      login: 'isaad',
      email: 'isaad@student.42abudhabi.ae',
      first_name: 'Imad',
      last_name: 'Saad',
      status: 'LIVE',
      image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    }
  });

  const friend1 = await prisma.friend.upsert({
    where: { friend_id: 1 },
    update: {
      friend_id: 2
    },
    create: {
      friend_id: 1
    }
  })

  const friend2 = await prisma.friend.upsert({
    where: { friend_id: 2 },
    update: {
      friend_id: 1
    },
    create: {
      friend_id: 2
    }
  })

  const powerUp1 = await prisma.powerUp.upsert({
    where: { type: 'sonic_ball' },
    update: { period: 1 },
    create: {
      type: 'sonic_ball',
      period: 2
    }
  })

  const achievement1 = await prisma.achievement.upsert({
    where: { type: 'points_hunter' },
    update: {},
    create: {
      type: "points_hunter",
      description: "Collect 100 points in one day.",
      points: 200
    }
  })
  

  console.log({ user1, user2, friend1, friend2, powerUp1, achievement1});
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });