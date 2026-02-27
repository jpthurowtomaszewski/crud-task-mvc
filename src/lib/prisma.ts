import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// pego a url do banco no .env
const databaseUrl = process.env.DATABASE_URL;

// se nao tiver url, eu ja paro e mostro erro claro
if (!databaseUrl) {
  throw new Error("DATABASE_URL nao foi definida no .env");
}

// pool de conexoes do pg (jeito comum pra postgres)
const pool = new Pool({
  connectionString: databaseUrl
});

// adapter que o Prisma 7 pede pra conectar no postgres
const adapter = new PrismaPg(pool);

// exporto uma instancia unica do prisma
export const prisma = new PrismaClient({ adapter });
