import { AppFrame, Card, PrimaryButton, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { assets, previewSlides, renderQueue } from "@/lib/mock-data";

export default function AssetsPage() {
  return (
    <Shell
      eyebrow="Generate Asset"
      title="Preview, generate, and queue assets."
      description="Flow ini menggabungkan preview mock, generate asset, dan rendering queue seperti pada referensi."
      actions={<PrimaryButton href="/library">Open Library</PrimaryButton>}
    >
      <AppFrame title="Generate Asset">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-6">
            <Card>
              <SectionTitle title="Preview Mock" description="No GPU preview style." />
              <div className="grid gap-4 sm:grid-cols-3">
                {previewSlides.map((slide) => (
                  <div key={slide} className="rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#5b3df5,#201833)] p-3">
                    <div className="flex h-40 items-end rounded-lg p-4 text-sm font-semibold text-white">
                      {slide}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle title="Generate Asset" description="Select output and run generation." />
              <Table
                headers={["Type", "Title", "Variant", "Status"]}
                rows={assets.map((asset) => [
                  asset.type,
                  asset.title,
                  asset.variant,
                  <StatusBadge key={asset.id} status={asset.status} />,
                ])}
              />
            </Card>
          </div>
          <Card>
            <SectionTitle title="Rendering Queue" description="Track asset render progress." />
            <div className="space-y-4">
              {renderQueue.map((job) => (
                <div key={job.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{job.name}</p>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
