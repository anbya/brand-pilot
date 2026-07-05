import { AppFrame, Card, SectionTitle, Shell, StatGrid } from "@/components/brandpilot";
import { analyticsStats } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <Shell
      eyebrow="Analytics"
      title="Performance overview."
      description="Panel analytics mengikuti struktur line-chart summary pada referensi."
    >
      <AppFrame title="Analytics Overview">
        <StatGrid stats={analyticsStats} />
        <Card className="mt-6">
          <SectionTitle title="Performance Trend" description="Synthetic trend chart placeholder." />
          <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="absolute inset-x-4 bottom-10 top-4 grid grid-cols-6 gap-4 opacity-40">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-r border-dashed border-slate-200" />
              ))}
            </div>
            <svg viewBox="0 0 800 220" className="h-full w-full">
              <path d="M20 180 C120 90, 180 120, 260 100 S420 130, 520 85 S690 120, 780 70" fill="none" stroke="#8b5cf6" strokeWidth="4" />
              <path d="M20 190 C130 150, 190 170, 270 140 S430 145, 520 130 S690 155, 780 112" fill="none" stroke="#ec4899" strokeWidth="3" />
              <path d="M20 200 C110 170, 200 155, 280 165 S430 170, 520 155 S690 170, 780 150" fill="none" stroke="#60a5fa" strokeWidth="3" />
            </svg>
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
