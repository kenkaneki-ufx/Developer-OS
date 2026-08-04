import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// Load .env.local file explicitly (higher priority than .env)
const envLocalPath = path.resolve(__dirname, ".env.local");
dotenv.config({ path: envLocalPath });

// Also load .env as fallback
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? '', 
  },
});
