-- CreateEnum
CREATE TYPE "Role" AS ENUM ('volunteer', 'organizer', 'admin');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('article', 'event');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'completed', 'full');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'volunteer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "OrganizerApplication" (
    "application_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "org_name" TEXT NOT NULL,
    "org_description" TEXT NOT NULL,
    "responsible_person" TEXT NOT NULL,
    "org_email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "website" TEXT,
    "org_address" TEXT NOT NULL,
    "experience" TEXT,
    "social_media" TEXT,
    "document_path" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizerApplication_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_type" "CategoryType" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Article" (
    "article_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "event_date" DATE NOT NULL,
    "event_time" TIME NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "required_items" TEXT,
    "provided_items" TEXT,
    "image_path" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "registration_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("registration_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_user_id_event_id_key" ON "EventRegistration"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "OrganizerApplication" ADD CONSTRAINT "OrganizerApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
