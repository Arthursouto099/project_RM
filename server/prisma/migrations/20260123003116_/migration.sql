-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "communityId" TEXT;

-- CreateTable
CREATE TABLE "public"."Community" (
    "id_community" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "id_owner" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "community_image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id_community")
);

-- CreateTable
CREATE TABLE "public"."_CommonUserToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CommonUserToCommunity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CommonUserToCommunity_B_index" ON "public"."_CommonUserToCommunity"("B");

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id_community") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Community" ADD CONSTRAINT "Community_id_owner_fkey" FOREIGN KEY ("id_owner") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CommonUserToCommunity" ADD CONSTRAINT "_CommonUserToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CommonUserToCommunity" ADD CONSTRAINT "_CommonUserToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;
