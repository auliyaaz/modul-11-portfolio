// src/lib/prisma.js
// Singleton pattern: pastikan hanya ada SATU koneksi Prisma di seluruh aplikasi.
// Ini penting saat development karena Next.js hot-reload bisa membuat banyak koneksi.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
