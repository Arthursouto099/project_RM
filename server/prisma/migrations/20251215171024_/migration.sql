-- CreateEnum
CREATE TYPE "public"."ProfessionalType" AS ENUM ('PSYCHOLOGIST', 'DOCTOR', 'LAWYER', 'NUTRITIONIST', 'COACH', 'THERAPIST', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('USER', 'PROFESSIONAL', 'CREATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."common_user" ADD COLUMN     "accountType" "public"."AccountType" NOT NULL DEFAULT 'USER',
ADD COLUMN     "professionalBio" TEXT,
ADD COLUMN     "professionalType" "public"."ProfessionalType",
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;
