/*
  Warnings:

  - You are about to drop the `Coment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Coment" DROP CONSTRAINT "Coment_id_post_fkey";

-- DropTable
DROP TABLE "public"."Coment";

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id_comment" TEXT NOT NULL,
    "id_post" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentCommentId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id_comment")
);

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."Post"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "public"."Comment"("id_comment") ON DELETE SET NULL ON UPDATE CASCADE;
