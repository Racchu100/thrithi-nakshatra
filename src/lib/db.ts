import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    let dbUrl = process.env.DATABASE_URL || "file:./dev.db";

    // On Vercel, copy dev.db to a writable location (/tmp) to prevent read-only filesystem crash
    if (process.env.VERCEL) {
      const tempDbPath = "/tmp/dev.db";
      const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");
      
      try {
        if (!fs.existsSync(tempDbPath)) {
          if (fs.existsSync(sourceDbPath)) {
            const tempDir = path.dirname(tempDbPath);
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
            fs.copyFileSync(sourceDbPath, tempDbPath);
            console.log("Database copied to /tmp successfully");
          } else {
            console.warn("Source database file not found at:", sourceDbPath);
          }
        }
        dbUrl = `file:${tempDbPath}`;
      } catch (err) {
        console.error("Failed to copy database to /tmp:", err);
      }
    }

    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
