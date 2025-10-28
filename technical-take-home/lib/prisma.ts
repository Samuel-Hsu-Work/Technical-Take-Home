import { PrismaClient } from "@prisma/client"; 

/**
 * According to Prisma documentation:
 * In Next.js (and other hot-reloading environments),
 * new PrismaClient instances may be created on every reload,
 * leading to "too many connections" errors.
 * 
 * The solution is to store the PrismaClient instance
 * on the global object during development and reuse it.
 */
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient; 
};

export const prisma =
	globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
