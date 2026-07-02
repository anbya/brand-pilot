import { Card, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { campaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  return (
    <Shell
      eyebrow="Campaign Generator"
      title="Campaign strategy builder untuk 7, 14, atau 30 hari."
      description="Halaman ini menangkap input goal, platform, duration, lalu menampilkan output strategy, content pillars, frequency, dan CTA recommendation."
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionTitle
            title="Generator inputs"
            description="Representasi form pembuatan campaign."
          />
          <div className="grid gap-4">
            {[
              "Campaign Name",
              "Goal: awareness / sales / promotion / education / event",
              "Platform: instagram / tiktok / facebook",
              "Duration: 7 / 14 / 30 days",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Generated campaigns"
            description="Output strategi yang siap diteruskan ke content calendar."
          />
          <Table
            headers={["Name", "Strategy", "Pillars", "Frequency", "Status"]}
            rows={campaigns.map((campaign) => [
              <div key={`${campaign.id}-name`}>
                <p className="font-medium text-slate-900">{campaign.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">
                  {campaign.goal}
                </p>
              </div>,
              campaign.strategy,
              campaign.contentPillars.join(", "),
              campaign.postingFrequency,
              <StatusBadge key={`${campaign.id}-status`} status={campaign.status} />,
            ])}
          />
        </Card>
      </section>
    </Shell>
  );
}
