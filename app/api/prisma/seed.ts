// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';
import { create } from 'domain';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

  // Create Users
  /////////////////////////////////////

  const bnaji = await prisma.user.upsert({
    where: { login: "bnaji" },
    update: {},
    create: {
      login: 'bnaji',
      email: 'bnaji@student.42abudhabi.ae',
      status: 'ONLINE',
      first_name: 'Bassam',
      last_name: 'Naji',
      image: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg'
    },
  })

  const isaad = await prisma.user.upsert({
    where: { login: "isaad" },
    update: {},
    create: {
      login: 'isaad',
      email: 'isaad@student.42abudhabi.ae',
      first_name: 'Imad',
      last_name: 'Saad',
      status: 'LIVE',
      image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    },
  })

  const aaljaber = await prisma.user.upsert({
    where: { login: "aaljaber" },
    update: {},
    create: {
      login: 'aaljaber',
      email: 'aaljaber@student.42abudhabi.ae',
      first_name: 'Abrar',
      last_name: 'Aljaberi',
      status: 'LIVE',
      image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    },
  })

  const mal_guna = await prisma.user.upsert({
    where: { login: "mal-guna" },
    update: {},
    create: {
      login: 'mal-guna',
      email: 'mal-guna@student.42abudhabi.ae',
      first_name: 'Moatasem',
      last_name: 'Al Gunaid',
      status: 'LIVE',
      image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    },
  })

  const oal_tena = await prisma.user.upsert({
    where: { login: "oal-tena" },
    update: {},
    create: {
      login: 'oal-tena',
      email: 'oal-tena@student.42abudhabi.ae',
      first_name: 'Obaid',
      last_name: 'Al Tenaiji',
      status: 'LIVE',
      image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    },
  })

  // Assign Users
  /////////////////////////////////////

  const users = [bnaji, isaad, aaljaber, mal_guna, oal_tena]

  // Create Friends
  /////////////////////////////////////

  const friends = await prisma.friend.createMany({
    data: [
      {friend_id: users[0].id},
      {friend_id: users[1].id},
      {friend_id: users[2].id},
      {friend_id: users[3].id},
      {friend_id: users[4].id},
    ],
  })

  // Assign Friends
  /////////////////////////////////////

  users[1] = await prisma.user.update({
    where: {
      login: "bnaji",
    },
    data: {
      friends: {
        connect: [{id: 2}, {id: 5}],
      },
    },
  })

  users[4] = await prisma.user.update({
    where: {
      login: "oal-tena",
    },
    data: {
      friends: {
        connect: [{id: 4}, {id: 3}, {id: 1}],
      },
    },
  })


  // Create powerUp
  /////////////////////////////////////

  const powerUp1 = await prisma.powerUp.upsert({
    where: { type: 'sonic_ball' },
    update: { period: 1 },
    create: {
      type: 'sonic_ball',
      period: 2
    }
  })


  // Assign Powerup
  /////////////////////////////////////


  const achievement1 = await prisma.achievement.upsert({
    where: { type: 'points_hunter' },
    update: {},
    create: {
      type: "points_hunter",
      description: "Collect 100 points in one day.",
      points: 200
    }
  })
  

  console.log({ users, friends, powerUp1, achievement1});
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