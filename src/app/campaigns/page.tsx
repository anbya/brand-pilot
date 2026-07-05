import { AppFrame, Card, PrimaryButton, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { campaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  return (
    <Shell
      eyebrow="Campaign Blueprint"
      title="Create and manage campaign blueprints."
      description="Layout ini mengikuti area new campaign dan campaign blueprint pada referensi."
      actions={<PrimaryButton href="/calendar">Generate Calendar</PrimaryButton>}
    >
      <AppFrame title="Campaign Blueprint">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <SectionTitle title="Create New Campaign" description="Goal, duration, and platforms." />
            <div className="grid gap-4">
              {["Campaign Name", "Business Objective", "Duration", "Platforms"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  {item}
                </div>
              ))}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-3">
                  {[65, 82, 48, 71].map((bar, index) => (
                    <div key={index}>
                      <div className="mb-2 text-xs text-slate-500">Pillar {index + 1}</div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                          style={{ width: `${bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Campaign Blueprints" description="Output LLM-only campaign structure." />
            <Table
              headers={["Name", "Goal", "Pillars", "Frequency", "Status"]}
              rows={campaigns.map((campaign) => [
                <span key={campaign.id} className="font-medium text-slate-900">
                  {campaign.name}
                </span>,
                campaign.goal,
                campaign.contentPillars.join(", "),
                campaign.postingFrequency,
                <StatusBadge key={`${campaign.id}-status`} status={campaign.status} />,
              ])}
            />
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
