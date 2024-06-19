/*
  Warnings:

  - You are about to drop the column `totalViews` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "totalViews",
ADD COLUMN     "likeCounter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewCounter" INTEGER NOT NULL DEFAULT 0;
