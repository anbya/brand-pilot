import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { assetLibrary } from "@/lib/mock-data";

export default function LibraryPage() {
  return (
    <Shell
      eyebrow="Asset Library"
      title="Generated asset collection."
      description="Library visual mengikuti blok asset library pada referensi."
      actions={<PrimaryButton href="/schedule">Schedule / Publish</PrimaryButton>}
    >
      <AppFrame title="Asset Library">
        <Card>
          <SectionTitle title="Library" description="Images, carousels, videos, and templates." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assetLibrary.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#5b3df5,#201833)] p-3">
                <div className="flex h-48 items-end rounded-lg p-4 text-sm font-semibold text-white">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
