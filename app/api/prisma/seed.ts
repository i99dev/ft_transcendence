// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

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
    },
  });

  const friend1 = await prisma.user.upsert({
    where: { login: 'friend1' },
    update: {
      login: 'friend3'
    },
    create: {
      login: "friend1",
      email: "friend1@email.com",
      status: "ONLINE",
      first_name: "Jane",
      last_name: "Smith",
    }
  })

  const friend2 = await prisma.user.upsert({
    where: { login: 'friend2' },
    update: {
    },
    create: {
      login: "friend2",
      email: "friend1@email.com",
      status: "ONLINE",
      first_name: "Jane",
      last_name: "Smith",
    }
  })

  console.log({ user1, user2, friend1, friend2 });
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