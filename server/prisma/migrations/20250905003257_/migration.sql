/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Video" DROP CONSTRAINT "Video_postId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "videos" TEXT[];

-- DropTable
DROP TABLE "public"."Image";

-- DropTable
DROP TABLE "public"."Video";
