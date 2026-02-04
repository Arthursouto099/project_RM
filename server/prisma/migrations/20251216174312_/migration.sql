-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('REVIEW', 'RECEIVED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."ReportRequest" (
    "id_report" TEXT NOT NULL,
    "id_requester" TEXT NOT NULL,
    "motive" TEXT NOT NULL,
    "id_post" TEXT NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'REVIEW',

    CONSTRAINT "ReportRequest_pkey" PRIMARY KEY ("id_report")
);

-- AddForeignKey
ALTER TABLE "public"."ReportRequest" ADD CONSTRAINT "ReportRequest_id_requester_fkey" FOREIGN KEY ("id_requester") REFERENCES "public"."common_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportRequest" ADD CONSTRAINT "ReportRequest_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."Post"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;
