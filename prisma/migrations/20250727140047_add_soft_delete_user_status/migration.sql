-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- AlterEnum
ALTER TYPE "OrganizerStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
