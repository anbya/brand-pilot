import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { canvasSlides } from "@/lib/mock-data";

export default function EditorPage() {
  return (
    <Shell
      eyebrow="Canvas Editor"
      title="Mock content editor."
      description="Layout ini mengikuti blok canvas editor pada referensi, dengan panel kiri slides, canvas tengah, dan panel kanan style."
      actions={<PrimaryButton href="/assets">Render</PrimaryButton>}
    >
      <AppFrame title="Canvas Editor">
        <div className="grid gap-6 xl:grid-cols-[180px_1fr_220px]">
          <Card className="p-4">
            <SectionTitle title="Slides" />
            <div className="space-y-3">
              {canvasSlides.map((slide, index) => (
                <div key={slide} className={`rounded-xl border p-3 text-sm ${index === 0 ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}>
                  {slide}
                </div>
              ))}
            </div>
          </Card>
          <Card className="bg-[linear-gradient(135deg,#3f2a93,#18121f)] p-5">
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-white/10 text-center text-white">
              <div>
                <p className="text-3xl font-semibold">5 KESALAHAN MEMILIH KOPI</p>
                <p className="mt-3 text-sm text-violet-100">Mock canvas preview</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <SectionTitle title="Design" />
            <div className="grid gap-3">
              {["Layout", "Typography", "Spacing", "Theme", "Alignment"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
