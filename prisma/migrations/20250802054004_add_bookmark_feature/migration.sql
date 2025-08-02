-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "volunteer_id" INTEGER NOT NULL,
    "article_id" INTEGER,
    "event_id" INTEGER,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bookmark_volunteer_id_idx" ON "Bookmark"("volunteer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_volunteer_id_article_id_key" ON "Bookmark"("volunteer_id", "article_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_volunteer_id_event_id_key" ON "Bookmark"("volunteer_id", "event_id");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("volunteer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("article_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
