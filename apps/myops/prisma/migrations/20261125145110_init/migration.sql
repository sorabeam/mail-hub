-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GMAIL', 'OUTLOOK');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "appPasswordEnc" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "gmMsgId" BIGINT NOT NULL,
    "messageIdHeader" TEXT,
    "subject" TEXT,
    "fromAddr" TEXT,
    "sentAt" TIMESTAMP(3),
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "blobSha256" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "deletedFromSourceAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Message_storageKey_key" ON "Message"("storageKey");

-- CreateIndex
CREATE INDEX "Message_accountId_sentAt_idx" ON "Message"("accountId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "Message_accountId_gmMsgId_key" ON "Message"("accountId", "gmMsgId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
