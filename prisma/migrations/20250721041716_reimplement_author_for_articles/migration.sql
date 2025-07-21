/*
  Warnings:

  - You are about to drop the column `user_id` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the `OrganizerApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[volunteer_id]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizer_id]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[volunteer_id,event_id]` on the table `EventRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `volunteer_id` to the `EventRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizerStatus" AS ENUM ('pending', 'approved', 'rejected');

-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_user_id_fkey";

-- DropForeignKey
ALTER TABLE "OrganizerApplication" DROP CONSTRAINT "OrganizerApplication_user_id_fkey";

-- DropIndex
DROP INDEX "Author_user_id_key";

-- DropIndex
DROP INDEX "EventRegistration_user_id_event_id_key";

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "user_id",
ADD COLUMN     "organizer_id" INTEGER,
ADD COLUMN     "volunteer_id" INTEGER;

-- AlterTable
ALTER TABLE "EventRegistration" DROP COLUMN "user_id",
ADD COLUMN     "volunteer_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrganizerApplication";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Volunteer" (
    "volunteer_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("volunteer_id")
);

-- CreateTable
CREATE TABLE "Organizer" (
    "organizer_id" SERIAL NOT NULL,
    "org_name" TEXT NOT NULL,
    "responsible_person" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "website" TEXT,
    "org_address" TEXT NOT NULL,
    "org_description" TEXT NOT NULL,
    "document_path" TEXT NOT NULL,
    "status" "OrganizerStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("organizer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_key" ON "Volunteer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_email_key" ON "Organizer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Author_volunteer_id_key" ON "Author"("volunteer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Author_organizer_id_key" ON "Author"("organizer_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_volunteer_id_event_id_key" ON "EventRegistration"("volunteer_id", "event_id");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("volunteer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("organizer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("organizer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("volunteer_id") ON DELETE CASCADE ON UPDATE CASCADE;
