-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "public"."FriendRequest" (
    "id_request" TEXT NOT NULL,
    "id_requester" TEXT NOT NULL,
    "id_receiver" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id_request")
);

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_id_requester_fkey" FOREIGN KEY ("id_requester") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_id_receiver_fkey" FOREIGN KEY ("id_receiver") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
