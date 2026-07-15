import { Card, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { assets, campaigns } from "@/lib/mock-data";

export default function DownloadsPage() {
  return (
    <Shell
      eyebrow="Download Center"
      title="Packaging campaign ke ZIP siap kirim ke user."
      description="Output bundle sesuai PRD: images, videos, captions, calendar CSV, dan README."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-slate-50">
          <SectionTitle
            title="ZIP contents"
            description="Struktur paket export campaign."
          />
          <div className="grid gap-3">
            {["images/", "videos/", "captions/", "calendar.csv", "README.txt"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Download packages"
            description="Published campaigns and their packaging status."
          />
          <Table
            headers={["Campaign", "ZIP Asset", "File Type", "Status"]}
            rows={campaigns.map((campaign, index) => {
              const zipAsset = assets.find((asset) => asset.type === "zip");
              return [
                campaign.name,
                zipAsset?.title ?? `Export ${index + 1}`,
                zipAsset?.format ?? "ZIP",
                <StatusBadge
                  key={`${campaign.id}-status`}
                  status={campaign.status === "published" ? "completed" : "queued"}
                />,
              ];
            })}
          />
        </Card>
      </section>
    </Shell>
  );
}
