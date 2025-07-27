-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "volunteer_id" INTEGER,
    "organizer_id" INTEGER,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_volunteer_id_key" ON "VerificationToken"("volunteer_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_organizer_id_key" ON "VerificationToken"("organizer_id");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("volunteer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("organizer_id") ON DELETE SET NULL ON UPDATE CASCADE;
