import { AppFrame, Card, PrimaryButton, SectionTitle, Shell, StatusBadge } from "@/components/brandpilot";
import { workspaceBrands } from "@/lib/mock-data";

export default function BrandsPage() {
  return (
    <Shell
      eyebrow="Brand Workspace"
      title="Manage brand workspaces."
      description="Screen ini mengikuti blok workspace pada referensi: daftar brand dengan quick status."
      actions={<PrimaryButton href="/brain">Brand Brain</PrimaryButton>}
    >
      <AppFrame title="Brand Workspace">
        <SectionTitle title="Brands" description="Manage all your brands in one place." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaceBrands.map((brand) => (
            <Card key={brand.name} className="p-4">
              <div className="rounded-xl bg-[linear-gradient(135deg,#e9d5ff,#ffffff)] p-3">
                <div className="h-28 rounded-lg bg-[linear-gradient(135deg,#5b3df5,#2b1f6b)]" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{brand.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{brand.owner}</p>
                </div>
                <StatusBadge status={brand.status} />
              </div>
            </Card>
          ))}
        </div>
      </AppFrame>
    </Shell>
  );
}
