import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");

const adapter = new PrismaBetterSqlite3({ 
  url: `file:${dbPath}` 
});

const prisma = new PrismaClient({ adapter });

export default prisma;