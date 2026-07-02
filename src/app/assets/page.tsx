import { Card, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { assets } from "@/lib/mock-data";

export default function AssetsPage() {
  return (
    <Shell
      eyebrow="Asset Studio"
      title="Image dan video generator untuk output visual campaign."
      description="Mewakili PNG, JPG, HD variations, dan vertical video 1080x1920 dengan subtitle dan voice-over placeholder."
    >
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-slate-50">
          <SectionTitle
            title="Video pipeline"
            description="Urutan script → image → animate → subtitle → render seperti di PRD."
          />
          <div className="space-y-3">
            {["Script", "Image", "Animate", "Subtitle", "Render"].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  {index + 1}
                </div>
                <p className="font-medium text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Generated assets"
            description="Asset metadata yang merepresentasikan assets, image_assets, dan video_assets."
          />
          <Table
            headers={["Type", "Title", "Format", "Variant", "Prompt", "Status"]}
            rows={assets.map((asset) => [
              asset.type,
              asset.title,
              asset.format,
              asset.variant,
              asset.prompt,
              <StatusBadge key={`${asset.id}-status`} status={asset.status} />,
            ])}
          />
        </Card>
      </section>
    </Shell>
  );
}
