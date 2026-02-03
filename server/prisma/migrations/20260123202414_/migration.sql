-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_communityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChatUser" DROP CONSTRAINT "ChatUser_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."Community" DROP CONSTRAINT "Community_id_owner_fkey";

-- DropForeignKey
ALTER TABLE "public"."FriendRequest" DROP CONSTRAINT "FriendRequest_id_receiver_fkey";

-- DropForeignKey
ALTER TABLE "public"."FriendRequest" DROP CONSTRAINT "FriendRequest_id_requester_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_id_sender_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_id_user_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReportRequest" DROP CONSTRAINT "ReportRequest_id_requester_fkey";

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatUser" ADD CONSTRAINT "ChatUser_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_id_sender_fkey" FOREIGN KEY ("id_sender") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_id_requester_fkey" FOREIGN KEY ("id_requester") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_id_receiver_fkey" FOREIGN KEY ("id_receiver") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportRequest" ADD CONSTRAINT "ReportRequest_id_requester_fkey" FOREIGN KEY ("id_requester") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Community" ADD CONSTRAINT "Community_id_owner_fkey" FOREIGN KEY ("id_owner") REFERENCES "public"."common_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
