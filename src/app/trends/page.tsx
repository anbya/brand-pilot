import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { trendMetrics } from "@/lib/mock-data";

export default function TrendsPage() {
  return (
    <Shell
      eyebrow="Trend Dashboard"
      title="Coffee XYZ trend dashboard."
      description="Mewakili blok trend dashboard pada referensi dengan metrik utama dan recent content."
      actions={<PrimaryButton href="/campaigns">View Calendar</PrimaryButton>}
    >
      <AppFrame title="Trend Dashboard">
        <div className="grid gap-4 md:grid-cols-3">
          {trendMetrics.map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <SectionTitle title="Recent Content" description="Preview asset terbaru." />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#3f2a93,#18121f)] p-3">
                <div className="h-28 rounded-lg bg-[linear-gradient(135deg,#8b5cf6,#2b1f6b)]" />
              </div>
            ))}
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
