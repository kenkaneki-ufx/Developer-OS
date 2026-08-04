import { PrismaClient } from "@prisma/client";

// PrismaClient is not compatible with edge runtime (middleware)
declare const EdgeRuntime: unknown;
const isEdgeRuntime = typeof EdgeRuntime !== "undefined";

// Only create PrismaClient if DATABASE_URL is configured
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

function createPrismaClient(): PrismaClient | null {
  // Skip PrismaClient creation in edge runtime
  if (isEdgeRuntime) {
    return null;
  }

  // Skip PrismaClient creation if no database URL
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Database features will be disabled.");
    return null;
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient | null = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
