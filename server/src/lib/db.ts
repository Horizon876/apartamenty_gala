import { PrismaClient } from '@prisma/client';

// Zapobiegamy tworzeniu wielu instancji Prisma Client w środowisku deweloperskim (np. przy hot reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
