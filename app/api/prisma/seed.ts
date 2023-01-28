// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  const user1 = await prisma.user.upsert({
    where: { username: 'bnaji' },
    update: {},
    create: {
      username: 'bnaji',
      fullname: 'Bassam Naji',
      email: 'bnaji@student.42abudhabi.ae',
      avatar: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg'
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'isaad' },
    update: {},
    create: {
      username: 'isaad',
      fullname: 'Imad Saad',
      email: 'isaad@student.42abudhabi.ae',
      avatar: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg'
    },
  });

  console.log({ user1, user2 });
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