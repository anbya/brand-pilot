# Product Requirements Document (PRD)

# AI Social Media Manager --- Phase 1 MVP

## 1. Overview..

### Project Name

**BrandPilot AI** *(working title)*

### Vision

Membantu UMKM menghasilkan konten media sosial selama 30 hari hanya
dalam beberapa menit menggunakan AI lokal.

Bukan sekadar AI Generator, tetapi **AI Marketing Assistant** yang
memahami bisnis pengguna.

------------------------------------------------------------------------

## 2. Goal MVP

Dalam waktu kurang dari **10 menit**, user dapat:

-   Membuat Brand Profile
-   Menghasilkan Content Calendar 30 hari
-   Generate caption
-   Generate image
-   Generate short video
-   Approve hasil
-   Download semua asset

**Belum termasuk pada fase ini:** - Auto posting - Analytics -
Competitor analysis

------------------------------------------------------------------------

## 3. Target User

### Primary

-   UMKM
-   Cafe
-   Restaurant
-   Barbershop
-   Salon
-   Klinik
-   Online Shop

### Secondary

-   Freelancer Social Media
-   Digital Marketing Agency

------------------------------------------------------------------------

## 4. Success Metrics

### Business KPI

-   100 registered users
-   20 active users
-   10 paid users

### Product KPI

-   Onboarding \< 5 menit
-   Generate campaign \< 5 menit
-   Approval rate \> 70%
-   Average session \> 15 menit

------------------------------------------------------------------------

## 5. Core Workflow

``` text
Register
    ↓
Create Brand
    ↓
Upload Logo
    ↓
Describe Business
    ↓
AI Learn Brand
    ↓
Generate 30 Days Campaign
    ↓
Review
    ↓
Regenerate if needed
    ↓
Generate Assets
    ↓
Approve
    ↓
Download ZIP
```

------------------------------------------------------------------------

## 6. Feature Scope

### Module 1 --- Authentication

-   Login
-   Register
-   Forgot Password
-   JWT Authentication
-   Refresh Token

### Module 2 --- Dashboard

-   Total Campaign
-   Draft
-   Approved
-   Assets Generated
-   Recent Campaign
-   Quick Action

### Module 3 --- Brand Profile

#### User Input

-   Company Name
-   Industry
-   Target Audience
-   Business Description
-   USP
-   Products
-   Services
-   Brand Voice
-   Language
-   Location
-   Website
-   Instagram
-   Facebook
-   TikTok
-   Primary Color
-   Secondary Color
-   Logo
-   Business Photos

#### AI Output

-   Brand Summary
-   Brand Personality
-   Target Persona
-   Writing Style
-   Marketing Tone
-   Keywords
-   Negative Prompt

------------------------------------------------------------------------

### Module 4 --- Campaign Generator

#### Input

-   Campaign Name
-   Goal
    -   Awareness
    -   Sales
    -   Promotion
    -   Education
    -   Event
-   Platform
    -   Instagram
    -   TikTok
    -   Facebook
-   Duration
    -   7 Days
    -   14 Days
    -   30 Days

#### Output

-   Campaign Strategy
-   Content Pillars
-   Posting Frequency
-   CTA Recommendation

------------------------------------------------------------------------

### Module 5 --- Content Calendar

#### CCA-606 Generated Content Workflow (Source of Truth)

```text
AI Plan Content / Create Content
    -> Idea Draft
    -> Preview / Edit Idea Draft
    -> Approve Draft
    -> Generated Ideas
    -> Preview Generated Ideas (read-only)
    -> Approve or Reject
    -> Generated Content Mock
    -> Content List
    -> View Post (read-only)
    -> Schedule Date and Time
    -> Calendar Grid
```

CCA-606 melanjutkan interaction flow CCA-605. `Approve Draft` langsung menghasilkan Generated Ideas dan menutup detail
drawer. Generated Ideas bersifat read-only dan hanya menyediakan `Approve`
atau `Reject`. Reject mengembalikan item ke Idea Draft agar dapat diedit dan
di-approve ulang. Approve langsung menghasilkan Generated Content dengan
status `Unscheduled`.

Generated Content dibuat oleh deterministic mock generator terpusat tanpa
backend atau API AI. Output bertipe ini menyimpan judul, platform, asset type,
headline, caption, CTA, hashtags, visual brief, metadata generator, dan status
awal `Unscheduled`. Output yang sama tampil di Content List.

Content List menyediakan action `View Post` yang membuka drawer detail seluruh
output generated content. Post berstatus Unscheduled hanya dapat diberi tanggal
dan waktu dari drawer tersebut; isi generated content tidak dapat diedit. Item tidak boleh tampil pada Month/Week Calendar Grid
sampai semua versi memiliki tanggal dan waktu, lalu pengguna menjalankan aksi
schedule. Planning Brief juga tidak boleh langsung membuat Calendar Post.

#### CCA-607 Generated Content Read-Only

```text
Idea Draft
    -> View / Edit / Approve
Generated Ideas
    -> View (read-only) / Approve / Reject
Generated Content
    -> View (read-only) / Schedule
Scheduled Generated Content
    -> View through Calendar (read-only)
```

Setelah Generated Ideas di-approve, seluruh hasil Generated Content bersifat
read-only. Perbaikan konten harus dilakukan sebelum approval Generated Ideas.
Content List tidak menyediakan action `Edit Post`; perubahan yang diizinkan
hanya `publishDate` dan `publishTime` selama item masih berstatus Unscheduled.
Aturan Generated Ideas pada bagian ini digantikan oleh CCA-612; Generated
Content dan Calendar Post tetap read-only.

#### CCA-608 Content Calendar Prototype Persistence

```text
First load without a saved snapshot
    -> Normalize initial mock state
    -> Persist versioned local snapshot
User mutation
    -> Persist updated snapshot
Browser refresh
    -> Restore latest snapshot
Reset Demo Data
    -> Clear prototype storage
    -> Persist initial mock state again
```

Calendar state disimpan melalui typed repository dengan schema version, bukan
diakses langsung oleh reducer. Repository melakukan validasi, normalisasi, dan
deduplikasi berdasarkan ID ketika snapshot dibaca. State UI sementara seperti
drawer yang terbuka tidak dipulihkan. Seluruh store prototype tetap lokal dan
tidak menggunakan backend atau API; interface repository menjadi boundary agar
adapter `localStorage` dapat diganti pada tahap integrasi berikutnya.

#### CCA-609 Generated Post Visual Preview

Generated Content menampilkan visual post preview selain metadata. Preview
menggunakan komponen presentasional yang sama pada Content List, generated post
dialog, dan Content Details Drawer yang dibuka dari Calendar Grid. Tampilan
menyesuaikan platform Instagram, TikTok, YouTube, atau Facebook serta content
type seperti carousel dan video.

Preview memuat brand identity, platform, asset type, headline, CTA, caption,
hashtags, schedule/status, indikator carousel, dan play treatment untuk konten
video. Preview hanya merepresentasikan output generated content dan tidak
menambahkan action edit; aturan read-only CCA-607 tetap berlaku.

#### CCA-610 Scheduled Calendar Posts Read-Only

```text
Idea Draft                  -> Edit / Approve
Generated Ideas             -> Read-only / Approve / Reject
Generated Content           -> Read-only / Schedule
Calendar Post: Scheduled    -> Read-only / Delete / Duplicate / Reschedule
Calendar Post: Published    -> Read-only / Duplicate
```

Post Details tidak menyediakan action atau handler `Edit Post`. Calendar Post
tidak memiliki mutation generik untuk content fields; reducer hanya menerima
`RESCHEDULE_VERSION` dengan field tanggal, waktu, timezone, dan timestamp, serta
menolak mutation tersebut bila status bukan `scheduled`. Published Post tidak
dapat di-reschedule.

Policy `canEditContent` menjadi guard terpusat. Sesuai CCA-612, entity
`content_work_item` dapat diubah hanya pada stage `idea_draft` atau
`generated_ideas`; Generated Content, Scheduled, dan Published tetap ditolak.
Form sumber Idea Draft hanya dapat menimpa stage `idea_draft`, sedangkan
Generated Ideas menggunakan mutation khusus yang memvalidasi stage-nya.

#### CCA-611 Scheduled Publishing Lifecycle

```text
Unscheduled -> Scheduled -> Publishing -> Published | Failed
```

Waktu schedule tidak mengubah status secara otomatis. Scheduled Post tetap
`Scheduled` walaupun waktunya sudah lewat sampai publishing process benar-benar
dimulai. `Published` hanya dapat dicapai dari `Publishing` setelah outcome
berhasil; outcome gagal menghasilkan `Failed`.

Prototype menyediakan simulasi eksplisit tanpa browser timer dan tanpa platform
API. Action `Demo: Start Publishing` hanya tersedia setelah schedule due. State
`Publishing` kemudian menyediakan outcome manual `Demo: Mark Published` atau
`Demo: Mark Failed`. Setiap transisi divalidasi kembali oleh pure lifecycle
functions di reducer dan menyimpan lifecycle timestamps pada Calendar Post.

`PublishingLifecycleRepository` menjadi boundary untuk implementasi backend
scheduler berikutnya. Backend dapat mengganti sumber command lifecycle tanpa
mengubah visual Calendar, persisted state shape, atau aturan read-only CCA-610.

#### CCA-612 Simplified Content Workflow

```text
AI Plan Content / Create Content
    -> Save Idea Draft
    -> Generate Ideas automatically
    -> Content List
    -> Preview / Edit Generated Ideas
    -> Approve Ideas
    -> Generate Content
    -> Unscheduled Content
    -> Schedule
    -> Calendar Grid
    -> Existing publishing lifecycle
```

Penyimpanan dari AI Plan Content atau Create Content mencatat Idea Draft lalu
langsung menghasilkan Generated Ideas secara deterministik dan mengembalikan
pengguna ke Content List. Generated Ideas dapat dilihat dan diedit melalui
mutation khusus sebelum approval. Flow reject dan approval Idea Draft terpisah
tidak digunakan lagi pada flow utama.

Approval Generated Ideas sekaligus menghasilkan Generated Content dengan status
`Unscheduled`. Generated Content tetap read-only, dapat dijadwalkan, lalu
mengikuti lifecycle CCA-611. Tidak ada Calendar Post yang dibuat sebelum aksi
Schedule dijalankan.

CCA-613 menggantikan tujuan navigasi setelah save khusus source `ai_plan`:
Generated Ideas dibuka pada dedicated page. Source `create_post` tetap kembali
ke Content List sesuai flow CCA-612.

#### CCA-613 Editable Generated Ideas Page

```text
AI Plan Content
    -> Save Draft & Generate Ideas
    -> Generated Ideas Page
    -> Preview / Edit Ideas
    -> Approve Ideas
    -> Generate Content
    -> Unscheduled Content
    -> Schedule Date and Time
    -> Calendar Grid
    -> Publishing Lifecycle
```

Hasil AI Plan Content dibuka pada dedicated Generated Ideas Page, bukan modal.
Halaman menggunakan tabel AI Draft Content Plan yang menampilkan planned date
and time, title, pillar, platform/format, objective, conflict, dan action edit.
Edit dilakukan per idea pada halaman yang sama dan disimpan melalui typed
workflow store. Tahap ini tidak menyediakan action scheduling, add/remove,
selection, atau regenerasi.

Approval berlaku untuk seluruh Generated Ideas dan langsung menjalankan
Generated Content flow existing. Hasilnya berstatus `Unscheduled`, lalu user
dikembalikan ke Content List untuk melihat visual preview dan mengatur jadwal.
Generated Content, scheduling, Calendar Grid, serta publishing lifecycle tidak
diubah oleh CCA-613.

#### CCA-604 Dedicated Content Input Pages

Input Content Calendar tidak menggunakan modal. Navigasi input menggunakan:

```text
/calendar
/calendar/ai-plan/new
/calendar/content/new
```

`AI Plan Content` membuka `/calendar/ai-plan/new` dan `Create Post` membuka
`/calendar/content/new`. Kedua halaman menyimpan Idea Draft, langsung membuat
Generated Ideas, lalu melanjutkan state machine CCA-612 dari Content List.

------------------------------------------------------------------------

### Module 6 --- AI Caption

-   Hook
-   Body
-   CTA
-   Hashtags
-   Emoji
-   Short Version
-   Long Version
-   Tone Selection
-   Regenerate

------------------------------------------------------------------------

### Module 7 --- Image Generator

-   PNG
-   JPG
-   HD
-   Multiple Variations

------------------------------------------------------------------------

### Module 8 --- Video Generator

-   5--10 detik
-   Vertical (1080×1920)
-   Subtitle
-   Voice Over
-   Music Placeholder

Pipeline:

``` text
Script
 ↓
Image
 ↓
Animate
 ↓
Subtitle
 ↓
Render
```

------------------------------------------------------------------------

### Module 9 --- Approval

Status: - Draft - Generating - Review - Approved - Rejected - Need
Revision

Bulk approval tersedia.

------------------------------------------------------------------------

### Module 10 --- Download

ZIP berisi: - Images - Videos - Captions - Calendar.csv - README.txt

------------------------------------------------------------------------

## 7. AI Pipeline

``` text
Brand Profile
      ↓
Brand Memory
      ↓
Campaign Planner Agent
      ↓
Calendar Planner Agent
      ↓
Caption Agent
      ↓
Image Agent
      ↓
Video Agent
      ↓
Packaging Agent
```

------------------------------------------------------------------------

## 8. AI Agents

1.  Brand Analyzer
2.  Campaign Planner
3.  Calendar Planner
4.  Caption Writer
5.  Image Prompt Engineer
6.  Video Prompt Engineer
7.  Packaging Agent

------------------------------------------------------------------------

## 9. Tech Stack

### Frontend

-   Next.js 16
-   React 19
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   TanStack Query
-   Zustand

### Backend

-   Next.js Route Handlers
-   PostgreSQL
-   Drizzle ORM
-   Redis
-   BullMQ

### AI

-   LangGraph.js
-   LangChain
-   Ollama

### Models

-   FLUX / SDXL
-   Wan 2.2
-   Kokoro
-   Whisper

### Others

-   FFmpeg
-   MinIO (Dev)
-   S3 Compatible Storage
-   Better Auth

------------------------------------------------------------------------

## 10. Database

-   User
-   Brand
-   Campaign
-   CalendarItem
-   Caption
-   ImageAsset
-   VideoAsset
-   PromptHistory
-   AIJob
-   DownloadPackage

------------------------------------------------------------------------

## 11. Queue

Redis + BullMQ

``` text
Generate Campaign
        ↓
Generate Calendar
        ↓
Generate Captions
        ↓
Generate Images
        ↓
Generate Videos
        ↓
Package ZIP
```

------------------------------------------------------------------------

## 12. API

``` http
POST   /brands
GET    /brands
PATCH  /brands/:id
DELETE /brands/:id

POST   /campaigns
GET    /campaigns
POST   /campaigns/:id/generate

POST   /calendar/:id/regenerate
POST   /caption/:id/regenerate

POST   /image/:id/generate
POST   /video/:id/generate

POST   /campaign/:id/approve
POST   /downloads/:campaignId
```

------------------------------------------------------------------------

## 13. Folder Structure

``` text
apps/
  web/
    app/
    components/
    features/
      auth/
      brands/
      campaigns/
      calendar/
      assets/
      ai/
    hooks/
    lib/

packages/
  ai/
    agents/
    prompts/
    graph/
  database/
  shared/
```

------------------------------------------------------------------------

## 14. Non-functional Requirements

-   Multi-tenant
-   Async AI Queue
-   Retry failed jobs
-   Real-time progress
-   Prompt history
-   Object Storage
-   Zod Validation
-   Logging & Tracing

------------------------------------------------------------------------

## 15. Roadmap

### Phase 2

-   Auto Posting
-   Approval Workflow
-   Analytics
-   Trend Discovery
-   Competitor Monitoring
-   Templates

### Phase 3

AI Marketing Manager: - Strategy Recommendation - A/B Testing -
Performance Optimization - Automatic Campaign Improvement

------------------------------------------------------------------------

## Implementation Order

1.  Infrastructure
2.  Authentication
3.  Brand Profile
4.  Campaign Generator
5.  Content Calendar
6.  Caption Generator
7.  Image Generator
8.  Video Generator
9.  Dashboard & Approval
10. Download ZIP

---

## 16. PostgreSQL Schema
nama database : brand-pilot
Schema ini dirancang untuk Phase 1 MVP dengan prinsip:

- Multi-tenant melalui `user_id`.
- Semua asset disimpan di object storage, database hanya menyimpan metadata dan URL/path.
- Output AI disimpan dalam kolom `JSONB` agar fleksibel.
- Semua proses AI berat dilacak melalui tabel `ai_jobs`.
- Prompt dan response AI disimpan untuk debugging dan audit.

### 16.1 Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

### 16.2 Enum Types

```sql
CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'member'
);

CREATE TYPE campaign_goal AS ENUM (
  'awareness',
  'sales',
  'promotion',
  'education',
  'event'
);

CREATE TYPE target_platform AS ENUM (
  'instagram',
  'tiktok',
  'facebook'
);

CREATE TYPE campaign_status AS ENUM (
  'draft',
  'generating',
  'review',
  'approved',
  'rejected',
  'need_revision',
  'failed'
);

CREATE TYPE content_status AS ENUM (
  'draft',
  'generating',
  'review',
  'approved',
  'rejected',
  'need_revision',
  'failed'
);

CREATE TYPE asset_type AS ENUM (
  'logo',
  'business_photo',
  'image',
  'video',
  'audio',
  'subtitle',
  'zip',
  'other'
);

CREATE TYPE ai_job_type AS ENUM (
  'brand_analyze',
  'campaign_generate',
  'calendar_generate',
  'caption_generate',
  'image_generate',
  'video_generate',
  'package_zip'
);

CREATE TYPE ai_job_status AS ENUM (
  'queued',
  'running',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE prompt_direction AS ENUM (
  'request',
  'response'
);
```

---

### 16.3 Users

Digunakan untuk autentikasi dan ownership data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'owner',
  email_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

---

### 16.4 Refresh Tokens

Untuk JWT refresh token.

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
```

---

### 16.5 Brands

Menyimpan profil bisnis dan hasil analisis AI.

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  company_name TEXT NOT NULL,
  industry TEXT,
  target_audience TEXT,
  business_description TEXT,
  usp TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,

  brand_voice TEXT,
  language TEXT NOT NULL DEFAULT 'id',
  location TEXT,
  website_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,

  primary_color TEXT,
  secondary_color TEXT,
  logo_asset_id UUID,

  ai_brand_summary TEXT,
  ai_brand_personality TEXT,
  ai_target_persona JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_writing_style TEXT,
  ai_marketing_tone TEXT,
  ai_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_negative_prompt TEXT,
  ai_memory JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_company_name ON brands(company_name);
CREATE INDEX idx_brands_deleted_at ON brands(deleted_at);
```

> Catatan: `logo_asset_id` dapat dihubungkan ke `assets.id` setelah tabel `assets` dibuat. Constraint foreign key bisa ditambahkan setelah semua tabel dibuat.

---

### 16.6 Campaigns

Menyimpan strategi campaign dan status keseluruhan.

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  goal campaign_goal NOT NULL,
  platforms target_platform[] NOT NULL DEFAULT ARRAY['instagram']::target_platform[],
  duration_days INT NOT NULL DEFAULT 30 CHECK (duration_days IN (7, 14, 30)),

  description TEXT,
  start_date DATE,
  end_date DATE,

  status campaign_status NOT NULL DEFAULT 'draft',

  ai_strategy TEXT,
  ai_content_pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_posting_frequency JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_cta_recommendation TEXT,
  ai_raw_output JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
```

---

### 16.7 Calendar Items

Satu campaign memiliki banyak item kalender konten.

```sql
CREATE TABLE calendar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  day_number INT NOT NULL CHECK (day_number >= 1),
  scheduled_date DATE,
  platform target_platform NOT NULL DEFAULT 'instagram',

  topic TEXT NOT NULL,
  hook TEXT,
  objective TEXT,
  cta TEXT,
  asset_needed TEXT,
  caption_preview TEXT,
  content_format TEXT,

  status content_status NOT NULL DEFAULT 'draft',
  ai_raw_output JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,

  UNIQUE(campaign_id, day_number, platform)
);

CREATE INDEX idx_calendar_items_user_id ON calendar_items(user_id);
CREATE INDEX idx_calendar_items_campaign_id ON calendar_items(campaign_id);
CREATE INDEX idx_calendar_items_status ON calendar_items(status);
CREATE INDEX idx_calendar_items_scheduled_date ON calendar_items(scheduled_date);
```

---

### 16.8 Captions

Menyimpan caption final dan variasi caption.

```sql
CREATE TABLE captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID NOT NULL REFERENCES calendar_items(id) ON DELETE CASCADE,

  tone TEXT,
  hook TEXT,
  body TEXT,
  cta TEXT,
  hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
  emojis JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_version TEXT,
  long_version TEXT,
  final_caption TEXT,

  version INT NOT NULL DEFAULT 1,
  is_selected BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'draft',
  ai_raw_output JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_captions_user_id ON captions(user_id);
CREATE INDEX idx_captions_campaign_id ON captions(campaign_id);
CREATE INDEX idx_captions_calendar_item_id ON captions(calendar_item_id);
CREATE INDEX idx_captions_is_selected ON captions(is_selected);
```

---

### 16.9 Assets

Tabel umum untuk semua file: logo, business photos, image hasil AI, video, audio, subtitle, dan ZIP.

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID REFERENCES calendar_items(id) ON DELETE CASCADE,

  type asset_type NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_size_bytes BIGINT,
  storage_provider TEXT NOT NULL DEFAULT 'minio',
  storage_bucket TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  public_url TEXT,

  width INT,
  height INT,
  duration_seconds NUMERIC(10,2),

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,

  UNIQUE(storage_bucket, storage_key)
);

CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_brand_id ON assets(brand_id);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_assets_calendar_item_id ON assets(calendar_item_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_deleted_at ON assets(deleted_at);
```

Tambahkan foreign key logo setelah `assets` tersedia:

```sql
ALTER TABLE brands
ADD CONSTRAINT fk_brands_logo_asset
FOREIGN KEY (logo_asset_id) REFERENCES assets(id) ON DELETE SET NULL;
```

---

### 16.10 Image Assets

Metadata khusus untuk gambar hasil AI.

```sql
CREATE TABLE image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID REFERENCES calendar_items(id) ON DELETE SET NULL,

  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  model_name TEXT,
  aspect_ratio TEXT DEFAULT '1:1',
  seed BIGINT,
  generation_params JSONB NOT NULL DEFAULT '{}'::jsonb,

  variation_number INT NOT NULL DEFAULT 1,
  is_selected BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'review',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_image_assets_asset_id ON image_assets(asset_id);
CREATE INDEX idx_image_assets_campaign_id ON image_assets(campaign_id);
CREATE INDEX idx_image_assets_calendar_item_id ON image_assets(calendar_item_id);
CREATE INDEX idx_image_assets_is_selected ON image_assets(is_selected);
```

---

### 16.11 Video Assets

Metadata khusus untuk video hasil AI.

```sql
CREATE TABLE video_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID REFERENCES calendar_items(id) ON DELETE SET NULL,

  script TEXT,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  model_name TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  resolution TEXT DEFAULT '1080x1920',
  duration_seconds NUMERIC(10,2) DEFAULT 10,
  fps INT DEFAULT 24,
  seed BIGINT,
  generation_params JSONB NOT NULL DEFAULT '{}'::jsonb,

  subtitle_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  voice_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  thumbnail_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,

  variation_number INT NOT NULL DEFAULT 1,
  is_selected BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'review',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_video_assets_asset_id ON video_assets(asset_id);
CREATE INDEX idx_video_assets_campaign_id ON video_assets(campaign_id);
CREATE INDEX idx_video_assets_calendar_item_id ON video_assets(calendar_item_id);
CREATE INDEX idx_video_assets_is_selected ON video_assets(is_selected);
```

---

### 16.12 AI Jobs

Melacak semua job asynchronous dari BullMQ/Redis.

```sql
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID REFERENCES calendar_items(id) ON DELETE CASCADE,

  job_type ai_job_type NOT NULL,
  status ai_job_status NOT NULL DEFAULT 'queued',

  queue_name TEXT NOT NULL DEFAULT 'ai',
  bullmq_job_id TEXT,

  progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  error_stack TEXT,

  attempt_count INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,

  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_jobs_user_id ON ai_jobs(user_id);
CREATE INDEX idx_ai_jobs_campaign_id ON ai_jobs(campaign_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_job_type ON ai_jobs(job_type);
CREATE INDEX idx_ai_jobs_created_at ON ai_jobs(created_at DESC);
```

---

### 16.13 Prompt History

Menyimpan prompt dan response AI untuk debugging.

```sql
CREATE TABLE prompt_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  calendar_item_id UUID REFERENCES calendar_items(id) ON DELETE CASCADE,
  ai_job_id UUID REFERENCES ai_jobs(id) ON DELETE SET NULL,

  agent_name TEXT NOT NULL,
  model_name TEXT,
  direction prompt_direction NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  token_input INT,
  token_output INT,
  latency_ms INT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prompt_histories_user_id ON prompt_histories(user_id);
CREATE INDEX idx_prompt_histories_campaign_id ON prompt_histories(campaign_id);
CREATE INDEX idx_prompt_histories_ai_job_id ON prompt_histories(ai_job_id);
CREATE INDEX idx_prompt_histories_agent_name ON prompt_histories(agent_name);
CREATE INDEX idx_prompt_histories_created_at ON prompt_histories(created_at DESC);
```

---

### 16.14 Download Packages

Menyimpan ZIP hasil export campaign.

```sql
CREATE TABLE download_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,

  status ai_job_status NOT NULL DEFAULT 'queued',
  file_name TEXT,
  file_size_bytes BIGINT,
  expires_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  error_message TEXT
);

CREATE INDEX idx_download_packages_user_id ON download_packages(user_id);
CREATE INDEX idx_download_packages_campaign_id ON download_packages(campaign_id);
CREATE INDEX idx_download_packages_status ON download_packages(status);
```

---

### 16.15 Settings

Untuk konfigurasi global seperti model default, storage config, default prompt, dan rate limit.

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);
```

---

### 16.16 Updated At Trigger

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_campaigns_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_calendar_items_updated_at
BEFORE UPDATE ON calendar_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_captions_updated_at
BEFORE UPDATE ON captions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_assets_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_image_assets_updated_at
BEFORE UPDATE ON image_assets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_video_assets_updated_at
BEFORE UPDATE ON video_assets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ai_jobs_updated_at
BEFORE UPDATE ON ai_jobs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_download_packages_updated_at
BEFORE UPDATE ON download_packages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

### 16.17 Recommended Seed Settings

```sql
INSERT INTO settings (key, value, description) VALUES
(
  'ai.default_models',
  '{
    "llm": "ollama:qwen2.5:14b",
    "image": "flux-dev",
    "video": "wan2.2",
    "tts": "kokoro",
    "stt": "whisper"
  }'::jsonb,
  'Default local AI models for Phase 1 MVP'
),
(
  'generation.limits',
  '{
    "max_campaign_days": 30,
    "max_image_variations": 4,
    "max_video_duration_seconds": 10,
    "max_parallel_video_jobs": 1,
    "max_parallel_image_jobs": 2
  }'::jsonb,
  'Default generation limits for local 24GB VRAM server'
),
(
  'storage.default',
  '{
    "provider": "minio",
    "bucket": "brandpilot-assets"
  }'::jsonb,
  'Default object storage configuration'
);
```

---

### 16.18 Entity Relationship Summary

```text
users
  └── brands
        └── campaigns
              └── calendar_items
                    ├── captions
                    ├── image_assets
                    └── video_assets

assets
  ├── logo
  ├── business photos
  ├── generated images
  ├── generated videos
  ├── audio
  ├── subtitles
  └── download zip

ai_jobs
  ├── brand_analyze
  ├── campaign_generate
  ├── calendar_generate
  ├── caption_generate
  ├── image_generate
  ├── video_generate
  └── package_zip

prompt_histories
  └── stores request/response from every AI agent
```
