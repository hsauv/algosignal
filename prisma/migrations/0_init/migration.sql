-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('HEALTHCARE', 'EMPLOYMENT', 'CREDIT', 'JUSTICE', 'EDUCATION', 'HOUSING', 'OTHER');

-- CreateEnum
CREATE TYPE "BiasType" AS ENUM ('GENDER', 'ETHNICITY', 'AGE', 'DISABILITY', 'LANGUAGE', 'GEOGRAPHY', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PUBLISHED', 'VERIFIED', 'REMOVED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domain" "Domain" NOT NULL,
    "systemName" TEXT NOT NULL,
    "biasTypes" "BiasType"[],
    "description" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "status" "ReportStatus" NOT NULL DEFAULT 'PUBLISHED',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "deletionTokenHash" TEXT,
    "userId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_domain_idx" ON "Report"("domain");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_reportId_idx" ON "Comment"("reportId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

