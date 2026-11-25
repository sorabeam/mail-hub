import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile("../../.env");
} catch (e) {
  // ไม่มีไฟล์ .env (เช่นใน Docker) = ปกติ ใช้ค่าจาก environment แทน
  // error อื่น เช่น ไฟล์มีแต่อ่านไม่ได้ ให้พังตามปกติ
  if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
