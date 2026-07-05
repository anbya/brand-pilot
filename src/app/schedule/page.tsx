import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { schedulePosts } from "@/lib/mock-data";

export default function SchedulePage() {
  return (
    <Shell
      eyebrow="Schedule / Publish"
      title="Schedule post and preview."
      description="Screen ini meniru panel schedule dan preview pada referensi."
      actions={<PrimaryButton href="/analytics">Schedule Post</PrimaryButton>}
    >
      <AppFrame title="Schedule Post">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <SectionTitle title="Schedule Post" description="Select channel, date, and post." />
            <div className="grid gap-3">
              {schedulePosts.map((item) => (
                <div key={item.channel} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="font-medium text-slate-900">{item.channel}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.date} • {item.time}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="bg-[linear-gradient(135deg,#5b3df5,#201833)] p-5">
            <SectionTitle title="Post Preview" description="Visual preview before publish." />
            <div className="flex min-h-[360px] items-end rounded-2xl border border-white/10 p-6 text-white">
              <div>
                <p className="text-3xl font-semibold">5 KESALAHAN MEMILIH KOPI</p>
                <p className="mt-3 text-sm text-violet-100">Instagram carousel preview</p>
              </div>
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
