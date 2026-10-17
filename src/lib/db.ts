import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function safePrismaQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (
      error instanceof PrismaClientInitializationError ||
      /Environment variable not found: DATABASE_URL|Can't reach database server|P1001|P2027/i.test(message)
    ) {
      return fallback;
    }

    throw error;
  }
}
