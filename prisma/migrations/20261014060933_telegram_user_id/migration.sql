/*
  Warnings:

  - You are about to drop the column `telegramChatId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegramUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_telegramChatId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "telegramChatId",
ADD COLUMN     "telegramUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramUserId_key" ON "users"("telegramUserId");
