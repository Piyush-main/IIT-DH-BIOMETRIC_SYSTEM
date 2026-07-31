/**
 * Single shared PrismaClient instance.
 *
 * In dev, `tsx watch` re-executes this module on every file change. If we
 * instantiate `new PrismaClient()` at module scope naively, each reload
 * opens a fresh connection pool without closing the old one, and Supabase's
 * connection limit gets exhausted within a few edits. Stashing the client
 * on `globalThis` survives the reload and reuses the existing connection.
 */
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
