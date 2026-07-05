import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";

export default function SettingsPage() {
  return (
    <Shell
      eyebrow="Settings"
      title="Workspace profile and preferences."
      description="Struktur ini mengikuti panel settings pada referensi."
      actions={<PrimaryButton href="/pricing">View Plans</PrimaryButton>}
    >
      <AppFrame title="Workspace Profile">
        <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
          <Card>
            <SectionTitle title="Menu" />
            <div className="grid gap-3">
              {["Workspace", "Billing", "Integrations", "Brand Templates", "Notifications"].map(
                (item, index) => (
                  <div
                    key={item}
                    className={`rounded-xl px-4 py-3 text-sm ${index === 0 ? "bg-violet-50 text-violet-700" : "border border-slate-200 bg-white text-slate-600"}`}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Workspace Profile" description="Profile fields and workspace metadata." />
            <div className="grid gap-4 md:grid-cols-2">
              {["Workspace Name", "Website", "Language", "Region", "Time Zone", "Owner Email"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
