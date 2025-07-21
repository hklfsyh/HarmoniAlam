/*
  Warnings:

  - The values [admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `Article` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('volunteer', 'organizer');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'volunteer';
COMMIT;

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_user_id_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "user_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Author" (
    "author_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "admin_id" INTEGER,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("author_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Author_user_id_key" ON "Author"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Author_admin_id_key" ON "Author"("admin_id");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE CASCADE ON UPDATE CASCADE;
