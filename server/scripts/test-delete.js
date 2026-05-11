const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const nameToDelete = "sigma premium rooom";
  const room = await prisma.roomType.findUnique({
    where: { name: nameToDelete }
  });

  if (!room) {
    console.log(`Room "${nameToDelete}" not found.`);
    return;
  }

  console.log(`Deleting room: ${room.name} (${room.id})`);
  const deleted = await prisma.roomType.delete({
    where: { id: room.id }
  });
  console.log('Deleted successfully:', deleted);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
