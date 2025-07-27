-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "volunteer_id" INTEGER,
    "organizer_id" INTEGER,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_volunteer_id_key" ON "PasswordResetToken"("volunteer_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_organizer_id_key" ON "PasswordResetToken"("organizer_id");

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("volunteer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("organizer_id") ON DELETE CASCADE ON UPDATE CASCADE;
