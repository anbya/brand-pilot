import { AppFrame, Card, Field, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";
import { brandBrainFields } from "@/lib/mock-data";

export default function BrainPage() {
  return (
    <Shell
      eyebrow="Brand Brain"
      title="Brand memory, tone, and references."
      description="Screen ini mengikhti panel brand brain pada referensi."
      actions={<PrimaryButton href="/knowledge">Open Knowledge Base</PrimaryButton>}
    >
      <AppFrame title="Brand Brain">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <SectionTitle title="Brand Profile" description="Brand memory yang dipakai agent." />
            <div className="grid gap-3 md:grid-cols-2">
              {brandBrainFields.map(([label, value]) => (
                <Field key={label} label={label} value={value} />
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Reference Assets" description="Visual cues dan brand examples." />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#5b3df5,#24193a)] p-3">
                  <div className="h-24 rounded-lg bg-[linear-gradient(135deg,#d8b4fe,#ffffff)]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AppFrame>
    </Shell>
  );
}
