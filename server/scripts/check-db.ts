import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roomTypes = await prisma.roomType.findMany({
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });
  console.log(JSON.stringify(roomTypes, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
