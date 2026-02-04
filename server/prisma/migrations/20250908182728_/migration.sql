/*
  Warnings:

  - You are about to drop the column `created_at` on the `common_user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `common_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."common_user" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "public"."_UserFriends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFriends_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "public"."_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
