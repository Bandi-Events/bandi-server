import { PrismaClient } from '@prisma/client';
import faker from 'faker';

const userSeedData = Array.from({ length: 20 }).map(() => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

const transactionSeedData = Array.from({ length: 50 }).map(() => ({
  userId: Math.floor(Math.random() * 20) + 1,
  amount: faker.datatype.float(),
  date: faker.date.between('2021-07-01', '2021-08-01'),
}));

const balanceSeedData = userSeedData.map((_user, idx) => {
  const id = idx + 1;
  const transactions = transactionSeedData.filter(transaction => transaction.userId === id);
  const sum = transactions.reduce((acc, cur) => acc + cur.amount, 0);
  return { userId: id, total: sum };
});

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: userSeedData });
  await prisma.transaction.createMany({ data: transactionSeedData });
  await prisma.balance.createMany({ data: balanceSeedData });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
