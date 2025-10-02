-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id_chat" TEXT NOT NULL,
    "name" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id_chat")
);

-- CreateTable
CREATE TABLE "public"."ChatUser" (
    "id_chat" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id_chat","id_user")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id_message" TEXT NOT NULL,
    "id_chat" TEXT NOT NULL,
    "id_sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "status" "public"."MessageStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id_message")
);

-- AddForeignKey
ALTER TABLE "public"."ChatUser" ADD CONSTRAINT "ChatUser_id_chat_fkey" FOREIGN KEY ("id_chat") REFERENCES "public"."Chat"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatUser" ADD CONSTRAINT "ChatUser_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_id_chat_fkey" FOREIGN KEY ("id_chat") REFERENCES "public"."Chat"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_id_sender_fkey" FOREIGN KEY ("id_sender") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
