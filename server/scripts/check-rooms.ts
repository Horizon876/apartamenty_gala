const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const rooms = await prisma.roomType.findMany({
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });
    console.log('--- ROOM TYPES IN DB ---');
    rooms.forEach(r => {
      console.log(`ID: ${r.id} | Name: ${r.name} | Bookings: ${r._count.bookings}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
