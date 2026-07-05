import { AppFrame, Card, MiniProgress, PrimaryButton, SectionTitle, Shell, StatGrid, Table } from "@/components/brandpilot";
import { campaigns, dashboardStats, renderQueue } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <Shell
      eyebrow="Dashboard Overview"
      title="Good morning, Sarah."
      description="Dashboard utama mengikuti struktur referensi: sidebar workspace, stats cards, recent campaign, dan quick actions."
      actions={<PrimaryButton href="/campaigns">New Campaign</PrimaryButton>}
    >
      <AppFrame title="Dashboard Overview">
        <StatGrid stats={dashboardStats} />
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <SectionTitle title="Recent Campaigns" description="Progress campaign aktif." />
            <Table
              headers={["Campaign", "Goal", "Platform", "Progress"]}
              rows={campaigns.map((campaign, index) => [
                <span key={campaign.id} className="font-medium text-slate-900">
                  {campaign.name}
                </span>,
                campaign.goal,
                campaign.platforms.join(", "),
                <div key={index} className="min-w-[140px]">
                  <MiniProgress label="Completion" value={index === 0 ? 89 : 52} />
                </div>,
              ])}
            />
          </Card>
          <Card>
            <SectionTitle title="Quick Actions" description="Arahkan user ke workflow inti." />
            <div className="grid gap-3">
              {["New Campaign", "Brand Audit", "Generate Assets", "Schedule Post"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {renderQueue.map((job) => (
                <MiniProgress key={job.name} label={job.name} value={job.progress} />
              ))}
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
