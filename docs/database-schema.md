# Database Schema

Last updated: 2026-07-21
Prisma migration: `20260720234011_init`
Database: PostgreSQL on Neon

This document is the required companion to `prisma/schema.prisma`. Any change to `prisma/schema.prisma` must update this file in the same change.

## Runtime Configuration

- `DATABASE_URL`: pooled Neon connection used by the Next.js runtime and Prisma Client.
- `DIRECT_URL`: direct Neon connection used by Prisma CLI migrations through `prisma.config.ts`.
- Prisma Client output: `src/generated/prisma`.
- Prisma singleton: `src/lib/prisma.ts`.
- Seed script: `prisma/seed.ts`.

## Entity Model

### `workspaces`

Tenant boundary for the product workspace.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. Existing seed uses `workspace-brand-pilot`. |
| `name` | `text` | Workspace display name. |
| `createdAt` | `timestamp` | Created by Prisma default. |
| `updatedAt` | `timestamp` | Updated automatically by Prisma. |

Relations: owns memberships, subscriptions, brands, campaigns, calendar items, assets, billing usages, operation jobs, and content workflows.

### `users`

Prototype user records for role and membership checks.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `name` | `text` | Display name. |
| `initials` | `text` | UI avatar initials. |
| `role` | `text` | Workspace role mirror for seeded dashboard users. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

### `workspace_memberships`

Joins users to workspaces and stores the role used by permissions.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `userId` | `text` | FK to `users.id`, cascade delete. |
| `role` | `text` | One of `admin`, `manager`, `editor`, `viewer` in app logic. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Constraints: unique `(workspaceId, userId)`.

### `workspace_subscriptions`

Stores the active plan and limits used by entitlement logic.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `planId` | `text` | App values: `starter`, `growth`, `custom`. |
| `status` | `text` | App values: `trialing`, `active`, `past_due`, `canceled`. |
| `billingInterval` | `text` | Currently `month`. |
| `currentPeriodStart`, `currentPeriodEnd` | `text` | Billing period dates as `YYYY-MM-DD`. |
| `assignedCampaignPackLimit` | `integer?` | Override for campaign pack quota. |
| `renderCreditLimit` | `integer?` | Workspace render credit limit. |
| `startedAt`, `canceledAt` | `text` | ISO timestamp strings. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Index: `(workspaceId, status)`.

### `brand_profiles`

Stores brand identity, channels, AI summary, and optional Brand Brain state.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `companyName`, `slug`, `industry` | `text` | Brand identity fields. |
| `targetAudience`, `businessDescription`, `usp` | `text` | Positioning fields. |
| `brandVoice`, `language`, `location` | `text` | Voice and locale fields. |
| `website`, `instagram`, `facebook`, `tiktok`, `youtube` | `text?` | Optional channel references. |
| `primaryColor`, `secondaryColor` | `text` | Brand color tokens. |
| `aiSummary`, `aiPersonality`, `aiTone` | `text` | AI-generated brand metadata. |
| `aiKeywords` | `text[]` | Prompt keywords. |
| `aiNegativePrompt` | `text` | Prompt exclusions. |
| `brain` | `jsonb?` | Flexible Brand Brain payload for voice, tone, logo, and core assets. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Constraints: unique `(workspaceId, slug)`.
Indexes: `workspaceId`.

### `campaigns`

Stores campaign planning, state, platform targets, and publish entitlement state.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `brandId` | `text` | FK to `brand_profiles.id`, restricted delete. |
| `name` | `text` | Campaign name. |
| `goal` | `text` | App values: `awareness`, `sales`, `promotion`, `education`, `event`. |
| `platforms` | `text[]` | Social platform IDs. |
| `durationDays` | `integer` | Normalized to 7, 14, or 30 in app mapping. |
| `startDate`, `endDate` | `text` | Campaign dates as `YYYY-MM-DD`. |
| `status` | `text` | App values: `blueprint`, `ready`, `published`. |
| `campaignPackConsumed` | `boolean` | Tracks billing pack usage for publish. |
| `campaignPackUsageId` | `text?` | Optional pointer to usage record. |
| `publishedAt`, `publishedBy` | `text?` | Publish audit fields. |
| `strategy` | `text` | Campaign strategy. |
| `contentPillars` | `text[]` | Pillar labels. |
| `postingFrequency` | `text` | Human-readable cadence. |
| `ctaRecommendation` | `text` | Suggested CTA. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Indexes: `(workspaceId, status)`, `brandId`.

### `calendar_items`

Stores generated or manual calendar content items.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `brandId` | `text?` | Optional FK to `brand_profiles.id`, set null on delete. |
| `campaignId` | `text?` | Optional FK to `campaigns.id`, set null on delete. |
| `dayNumber` | `integer` | Campaign day sequence. |
| `topic`, `hook`, `objective`, `cta` | `text` | Content planning fields. |
| `assetNeeded` | `text` | Visual/media requirement. |
| `captionPreview` | `text` | Draft caption preview. |
| `platform` | `text` | Social platform ID. |
| `status` | `text` | App values include `draft`, `review`, `approved`, `failed`. |
| `scheduledDate` | `text?` | Optional scheduled date as `YYYY-MM-DD`. |
| `metadata` | `jsonb?` | Flexible extension data. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Indexes: `(workspaceId, status)`, `campaignId`.

### `workspace_assets`

Stores asset metadata and relationship references. File bytes are not stored in this schema.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `name`, `fileName`, `mimeType` | `text` | File metadata. |
| `kind` | `text` | App values: `image`, `video`, `logo`, `document`, `generated`. |
| `source` | `text` | App values: `upload`, `ai-generation`, `logo-render`, `imported`. |
| `previewUrl` | `text` | Preview or placeholder URL. |
| `description` | `text` | Asset description. |
| `tags` | `text[]` | Search/filter tags. |
| `sizeBytes` | `integer` | File size metadata. |
| `brandIds`, `campaignIds` | `text[]` | Denormalized UI relationship IDs. |
| `usage` | `jsonb` | Usage references with type, entityId, and label. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Index: `(workspaceId, kind)`.

### `campaign_pack_usages`

Stores campaign pack consumption records created when campaigns are published.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `subscriptionId` | `text` | FK to `workspace_subscriptions.id`, cascade delete. |
| `campaignId` | `text` | FK to `campaigns.id`, cascade delete. |
| `billingPeriodStart`, `billingPeriodEnd` | `text` | Billing period dates. |
| `consumedAt`, `consumedBy` | `text` | Audit fields. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Constraints: unique `(subscriptionId, campaignId)`.
Index: `workspaceId`.

### `render_credit_usages`

Stores reserved, consumed, or refunded render credits.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `subscriptionId` | `text` | FK to `workspace_subscriptions.id`, cascade delete. |
| `contentId` | `text` | Content/calendar/asset identifier. |
| `renderJobId` | `text` | Idempotency key for render starts. |
| `credits` | `integer` | Credits reserved or consumed. |
| `status` | `text` | App values: `reserved`, `consumed`, `refunded`. |
| `createdAt`, `updatedAt` | `text` | ISO timestamp strings for compatibility with existing entitlement types. |

Constraints: unique `renderJobId`.
Index: `(workspaceId, status)`.

### `operation_jobs`

Persists queued/generating API operations that were previously only response-only mocks.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key, generated with `cuid()`. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `type` | `text` | Examples: `campaign_generation`, `download_package`, `caption_regeneration`. |
| `entityId` | `text` | Target entity ID. |
| `status` | `text` | Examples: `queued`, `generating`, `completed`, `failed`. |
| `message` | `text` | Human-readable state. |
| `metadata` | `jsonb?` | Optional operation payload. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Index: `(workspaceId, type, entityId)`.

### `content_workflows`

Flexible persistence point for AI plan, manual post, generated ideas, and scheduled content workflow records.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key. |
| `workspaceId` | `text` | FK to `workspaces.id`, cascade delete. |
| `title` | `text` | Workflow title. |
| `source` | `text` | App values: `ai_plan`, `create_post`. |
| `stage` | `text` | App values: `idea_draft`, `generated_ideas`, `unscheduled`, `scheduled`. |
| `brandId`, `campaignId` | `text?` | Optional denormalized relationship IDs. |
| `payload` | `jsonb` | Full workflow payload matching current TypeScript workflow types. |
| `createdAt`, `updatedAt` | `timestamp` | Prisma-managed timestamps. |

Indexes: `(workspaceId, source, stage)`, `brandId`, `campaignId`.

## API Coverage

Current database-backed endpoints:

- `GET /api/brands`
- `POST /api/brands`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `POST /api/campaign/[id]/approve`
- `POST /api/campaigns/[id]/generate`
- `GET /api/calendar`
- `POST /api/calendar/[id]/regenerate`
- `POST /api/caption/[id]/regenerate`
- `POST /api/image/[id]/generate`
- `POST /api/video/[id]/generate`
- `GET /api/assets`
- `POST /api/assets`
- `DELETE /api/assets/[id]`
- `GET /api/dashboard`
- `POST /api/downloads/[campaignId]`

## Maintenance Rules

1. Update `prisma/schema.prisma`.
2. Update this document in the same change.
3. Run `npm run db:generate`.
4. Create and apply a migration with `npm run db:migrate -- --name <change-name>`.
5. Update `prisma/seed.ts` if the change requires initial data.
6. Run `npm run db:seed` when seed data changes.
