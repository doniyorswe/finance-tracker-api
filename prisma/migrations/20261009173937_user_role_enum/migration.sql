-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- AlterTable: TEXT -> "Role". Prisma'ning DROP/ADD varianti o'rniga mavjud qiymatlarni saqlab cast qilamiz.
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
