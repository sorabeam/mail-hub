import { defineConfig } from "prisma/config";

// คำสั่ง prisma รันโดยมี cwd = apps/myops จึงต้องถอยขึ้นไป 2 ชั้นถึงจะเจอ .env ที่ root
process.loadEnvFile("../../.env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
