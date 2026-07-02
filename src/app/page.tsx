import Link from "next/link";
import {
  ActionRow,
  Card,
  MiniProgress,
  SectionTitle,
  Shell,
  StatGrid,
} from "@/components/brandpilot";
import {
  aiJobs,
  apiExamples,
  dashboardStats,
  databaseEntities,
  featureModules,
  queueStages,
  workflowSteps,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <Shell
      eyebrow="PRD implementation"
      title="BrandPilot AI sekarang sudah jadi MVP product shell yang bisa dijelajahi."
      description="Phase 1 ini mencakup halaman marketing, auth flow, dashboard, brand profile, campaign generator, content calendar, caption and asset review, approval desk, download center, dan mock API route yang mengikuti endpoint inti PRD."
    >
      <StatGrid stats={dashboardStats} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Core workflow"
            description="Seluruh alur utama PRD dipetakan menjadi experience yang bisa dinavigasi."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-blue-600">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Quick actions"
            description="Masuk langsung ke modul utama yang paling penting untuk MVP."
          />
          <ActionRow />
          <div className="mt-6 space-y-4">
            {aiJobs.map((job) => (
              <MiniProgress key={job.id} label={job.type} value={job.progress} />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Module coverage"
            description="Setiap modul Phase 1 diterjemahkan menjadi halaman dan data shape yang siap dikembangkan."
          />
          <div className="grid gap-4">
            {featureModules.map((module) => (
              <div
                key={module.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-lg font-semibold text-slate-900">{module.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {module.bullets.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Queue pipeline"
            description="Representasi proses async AI dari generator hingga packaging."
          />
          <div className="space-y-3">
            {queueStages.map((stage, index) => (
              <div
                key={stage}
                className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {index + 1}
                </div>
                <p className="font-medium text-slate-900">{stage}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Schema scope"
            description="Entitas utama database PRD juga sudah diterjemahkan ke model mock."
          />
          <div className="flex flex-wrap gap-2">
            {databaseEntities.map((entity) => (
              <span
                key={entity}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {entity}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">API ready</p>
            <div className="mt-3 space-y-2">
              {apiExamples.slice(0, 6).map((endpoint) => (
                <p key={endpoint}>{endpoint}</p>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Navigate the MVP
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
              Semua halaman inti sekarang sudah tersedia
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Buka dashboard
          </Link>
        </div>
      </section>
    </Shell>
  );
}
