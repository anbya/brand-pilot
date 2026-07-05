import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { contentOutput } from "@/lib/mock-data";

export default function ContentPage() {
  return (
    <Shell
      eyebrow="Content Output"
      title="Review generated content detail."
      description="Halaman ini meniru panel content output di referensi."
      actions={<PrimaryButton href="/editor">Edit Content</PrimaryButton>}
    >
      <AppFrame title={contentOutput.title}>
        <Card>
          <SectionTitle title={contentOutput.headline} description="Generated script and slide guidance." />
          <div className="space-y-3">
            {contentOutput.sections.map((section) => (
              <div key={section} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {section}
              </div>
            ))}
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
