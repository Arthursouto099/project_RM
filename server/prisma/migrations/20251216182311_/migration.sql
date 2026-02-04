-- DropForeignKey
ALTER TABLE "public"."ReportRequest" DROP CONSTRAINT "ReportRequest_id_post_fkey";

-- AddForeignKey
ALTER TABLE "public"."ReportRequest" ADD CONSTRAINT "ReportRequest_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "public"."Post"("id_post") ON DELETE CASCADE ON UPDATE CASCADE;
