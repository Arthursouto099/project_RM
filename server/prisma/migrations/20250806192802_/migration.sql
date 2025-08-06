-- CreateTable
CREATE TABLE "public"."common_user" (
    "id_user" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birth" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profile_image" TEXT,
    "cpf" TEXT NOT NULL,
    "fk_address" INTEGER,
    "contact" TEXT,
    "gender" TEXT,
    "emergency_contact" TEXT
);

-- CreateTable
CREATE TABLE "public"."address" (
    "id_address" INTEGER NOT NULL,
    "street" TEXT,
    "number" INTEGER,
    "cep" TEXT,
    "state" TEXT,
    "city" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id_address")
);

-- CreateIndex
CREATE UNIQUE INDEX "common_user_email_key" ON "public"."common_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_cpf_key" ON "public"."common_user"("cpf");

-- AddForeignKey
ALTER TABLE "public"."common_user" ADD CONSTRAINT "common_user_fk_address_fkey" FOREIGN KEY ("fk_address") REFERENCES "public"."address"("id_address") ON DELETE SET NULL ON UPDATE CASCADE;
