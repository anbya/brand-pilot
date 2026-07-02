import { Card, MiniProgress, SectionTitle, Shell, StatGrid, Table } from "@/components/brandpilot";
import { aiJobs, campaigns, dashboardStats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <Shell
      eyebrow="Dashboard"
      title="Control room untuk campaign, queue, dan quick monitoring."
      description="Mewakili module dashboard pada PRD: total campaign, draft, approved, generated assets, recent campaign, dan quick action."
    >
      <StatGrid stats={dashboardStats} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Recent campaign"
            description="Snapshot strategi campaign yang baru dibuat."
          />
          <Table
            headers={["Campaign", "Goal", "Platforms", "Duration", "Status"]}
            rows={campaigns.map((campaign) => [
              <span key={`${campaign.id}-name`} className="font-medium text-slate-900">
                {campaign.name}
              </span>,
              campaign.goal,
              campaign.platforms.join(", "),
              `${campaign.durationDays} hari`,
              <span key={`${campaign.id}-status`} className="capitalize">
                {campaign.status}
              </span>,
            ])}
          />
        </Card>

        <Card>
          <SectionTitle
            title="Live queue"
            description="Representasi progress AI job via Redis + BullMQ."
          />
          <div className="space-y-4">
            {aiJobs.map((job) => (
              <MiniProgress key={job.id} label={job.type} value={job.progress} />
            ))}
          </div>
        </Card>
      </section>
    </Shell>
  );
}
