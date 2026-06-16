import { PrismaClient } from '@prisma/client';

type GlobalWithPrisma = typeof globalThis & { prismaClient?: PrismaClient };

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalForPrisma.prismaClient ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaClient = prisma;
}
