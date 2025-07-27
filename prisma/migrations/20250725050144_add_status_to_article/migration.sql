-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'publish');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "status" "ArticleStatus" NOT NULL DEFAULT 'draft';
