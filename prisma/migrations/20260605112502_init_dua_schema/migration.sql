-- CreateEnum
CREATE TYPE "DuaStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "DuaBook" (
    "id" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "subtitleBn" TEXT,
    "subtitleEn" TEXT,
    "descriptionBn" TEXT,
    "descriptionEn" TEXT,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "coverImage" TEXT,
    "accentColor" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "DuaStatus" NOT NULL DEFAULT 'draft',
    "isVisibleInApp" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuaBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuaIndex" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "subtitleBn" TEXT,
    "subtitleEn" TEXT,
    "descriptionBn" TEXT,
    "descriptionEn" TEXT,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "DuaStatus" NOT NULL DEFAULT 'draft',
    "isVisibleInApp" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuaIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuaCategory" (
    "id" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionBn" TEXT,
    "descriptionEn" TEXT,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuaItem" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "indexId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescriptionBn" TEXT,
    "shortDescriptionEn" TEXT,
    "arabicText" TEXT,
    "banglaMeaning" TEXT,
    "englishMeaning" TEXT,
    "transliterationBn" TEXT,
    "transliterationEn" TEXT,
    "referenceBn" TEXT,
    "referenceEn" TEXT,
    "benefitsBn" TEXT,
    "benefitsEn" TEXT,
    "notesBn" TEXT,
    "notesEn" TEXT,
    "repeatCount" INTEGER NOT NULL DEFAULT 1,
    "tagsBn" TEXT[],
    "tagsEn" TEXT[],
    "searchKeywordsBn" TEXT,
    "searchKeywordsEn" TEXT,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "DuaStatus" NOT NULL DEFAULT 'draft',
    "isVisibleInApp" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DuaBook_slug_key" ON "DuaBook"("slug");

-- CreateIndex
CREATE INDEX "DuaBook_status_idx" ON "DuaBook"("status");

-- CreateIndex
CREATE INDEX "DuaBook_displayOrder_idx" ON "DuaBook"("displayOrder");

-- CreateIndex
CREATE INDEX "DuaBook_isVisibleInApp_idx" ON "DuaBook"("isVisibleInApp");

-- CreateIndex
CREATE INDEX "DuaBook_createdAt_idx" ON "DuaBook"("createdAt");

-- CreateIndex
CREATE INDEX "DuaBook_updatedAt_idx" ON "DuaBook"("updatedAt");

-- CreateIndex
CREATE INDEX "DuaIndex_bookId_idx" ON "DuaIndex"("bookId");

-- CreateIndex
CREATE INDEX "DuaIndex_status_idx" ON "DuaIndex"("status");

-- CreateIndex
CREATE INDEX "DuaIndex_displayOrder_idx" ON "DuaIndex"("displayOrder");

-- CreateIndex
CREATE INDEX "DuaIndex_isVisibleInApp_idx" ON "DuaIndex"("isVisibleInApp");

-- CreateIndex
CREATE INDEX "DuaIndex_createdAt_idx" ON "DuaIndex"("createdAt");

-- CreateIndex
CREATE INDEX "DuaIndex_updatedAt_idx" ON "DuaIndex"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DuaIndex_bookId_slug_key" ON "DuaIndex"("bookId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "DuaCategory_slug_key" ON "DuaCategory"("slug");

-- CreateIndex
CREATE INDEX "DuaCategory_createdAt_idx" ON "DuaCategory"("createdAt");

-- CreateIndex
CREATE INDEX "DuaCategory_updatedAt_idx" ON "DuaCategory"("updatedAt");

-- CreateIndex
CREATE INDEX "DuaItem_bookId_idx" ON "DuaItem"("bookId");

-- CreateIndex
CREATE INDEX "DuaItem_indexId_idx" ON "DuaItem"("indexId");

-- CreateIndex
CREATE INDEX "DuaItem_categoryId_idx" ON "DuaItem"("categoryId");

-- CreateIndex
CREATE INDEX "DuaItem_status_idx" ON "DuaItem"("status");

-- CreateIndex
CREATE INDEX "DuaItem_displayOrder_idx" ON "DuaItem"("displayOrder");

-- CreateIndex
CREATE INDEX "DuaItem_isVisibleInApp_idx" ON "DuaItem"("isVisibleInApp");

-- CreateIndex
CREATE INDEX "DuaItem_createdAt_idx" ON "DuaItem"("createdAt");

-- CreateIndex
CREATE INDEX "DuaItem_updatedAt_idx" ON "DuaItem"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DuaItem_indexId_slug_key" ON "DuaItem"("indexId", "slug");

-- AddForeignKey
ALTER TABLE "DuaIndex" ADD CONSTRAINT "DuaIndex_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "DuaBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuaItem" ADD CONSTRAINT "DuaItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "DuaBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuaItem" ADD CONSTRAINT "DuaItem_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "DuaIndex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuaItem" ADD CONSTRAINT "DuaItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DuaCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
