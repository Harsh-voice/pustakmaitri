-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredRank" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Book_featured_featuredRank_idx" ON "Book"("featured", "featuredRank");
