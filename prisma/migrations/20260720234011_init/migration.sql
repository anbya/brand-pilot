-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_memberships" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_subscriptions" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "billingInterval" TEXT NOT NULL,
    "currentPeriodStart" TEXT NOT NULL,
    "currentPeriodEnd" TEXT NOT NULL,
    "assignedCampaignPackLimit" INTEGER,
    "renderCreditLimit" INTEGER,
    "startedAt" TEXT NOT NULL,
    "canceledAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_profiles" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "businessDescription" TEXT NOT NULL,
    "usp" TEXT NOT NULL,
    "brandVoice" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "tiktok" TEXT,
    "youtube" TEXT,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "aiPersonality" TEXT NOT NULL,
    "aiTone" TEXT NOT NULL,
    "aiKeywords" TEXT[],
    "aiNegativePrompt" TEXT NOT NULL,
    "brain" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "platforms" TEXT[],
    "durationDays" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "campaignPackConsumed" BOOLEAN NOT NULL DEFAULT false,
    "campaignPackUsageId" TEXT,
    "publishedAt" TEXT,
    "publishedBy" TEXT,
    "strategy" TEXT NOT NULL,
    "contentPillars" TEXT[],
    "postingFrequency" TEXT NOT NULL,
    "ctaRecommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_items" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT,
    "campaignId" TEXT,
    "dayNumber" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "assetNeeded" TEXT NOT NULL,
    "captionPreview" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledDate" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_assets" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "sizeBytes" INTEGER NOT NULL,
    "brandIds" TEXT[],
    "campaignIds" TEXT[],
    "usage" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_pack_usages" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "billingPeriodStart" TEXT NOT NULL,
    "billingPeriodEnd" TEXT NOT NULL,
    "consumedAt" TEXT NOT NULL,
    "consumedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_pack_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "render_credit_usages" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "renderJobId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "render_credit_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_jobs" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_workflows" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "brandId" TEXT,
    "campaignId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_memberships_workspaceId_userId_key" ON "workspace_memberships"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "workspace_subscriptions_workspaceId_status_idx" ON "workspace_subscriptions"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "brand_profiles_workspaceId_idx" ON "brand_profiles"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "brand_profiles_workspaceId_slug_key" ON "brand_profiles"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "campaigns_workspaceId_status_idx" ON "campaigns"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "campaigns_brandId_idx" ON "campaigns"("brandId");

-- CreateIndex
CREATE INDEX "calendar_items_workspaceId_status_idx" ON "calendar_items"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "calendar_items_campaignId_idx" ON "calendar_items"("campaignId");

-- CreateIndex
CREATE INDEX "workspace_assets_workspaceId_kind_idx" ON "workspace_assets"("workspaceId", "kind");

-- CreateIndex
CREATE INDEX "campaign_pack_usages_workspaceId_idx" ON "campaign_pack_usages"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_pack_usages_subscriptionId_campaignId_key" ON "campaign_pack_usages"("subscriptionId", "campaignId");

-- CreateIndex
CREATE INDEX "render_credit_usages_workspaceId_status_idx" ON "render_credit_usages"("workspaceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "render_credit_usages_renderJobId_key" ON "render_credit_usages"("renderJobId");

-- CreateIndex
CREATE INDEX "operation_jobs_workspaceId_type_entityId_idx" ON "operation_jobs"("workspaceId", "type", "entityId");

-- CreateIndex
CREATE INDEX "content_workflows_workspaceId_source_stage_idx" ON "content_workflows"("workspaceId", "source", "stage");

-- CreateIndex
CREATE INDEX "content_workflows_brandId_idx" ON "content_workflows"("brandId");

-- CreateIndex
CREATE INDEX "content_workflows_campaignId_idx" ON "content_workflows"("campaignId");

-- AddForeignKey
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_subscriptions" ADD CONSTRAINT "workspace_subscriptions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_profiles" ADD CONSTRAINT "brand_profiles_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_items" ADD CONSTRAINT "calendar_items_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_items" ADD CONSTRAINT "calendar_items_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_items" ADD CONSTRAINT "calendar_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_assets" ADD CONSTRAINT "workspace_assets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_pack_usages" ADD CONSTRAINT "campaign_pack_usages_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_pack_usages" ADD CONSTRAINT "campaign_pack_usages_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "workspace_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_pack_usages" ADD CONSTRAINT "campaign_pack_usages_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "render_credit_usages" ADD CONSTRAINT "render_credit_usages_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "render_credit_usages" ADD CONSTRAINT "render_credit_usages_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "workspace_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_jobs" ADD CONSTRAINT "operation_jobs_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_workflows" ADD CONSTRAINT "content_workflows_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
