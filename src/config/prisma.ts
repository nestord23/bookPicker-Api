import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { config } from "./config.js";

/**
 * Cliente Prisma unico para toda la aplicacion.
 *
 * El patron singleton evita abrir multiples conexiones a la BD:
 * en desarrollo con tsx watch cada recarga re-ejecutaria este modulo
 * y crearia un cliente nuevo acumulando file handles; el cache en
 * globalThis reutiliza la instancia previa entre recargas.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: config.databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (config.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
