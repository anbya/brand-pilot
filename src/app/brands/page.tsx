import { Card, Field, SectionTitle, Shell } from "@/components/brandpilot";
import { brandProfile } from "@/lib/mock-data";

export default function BrandsPage() {
  return (
    <Shell
      eyebrow="Brand Profile"
      title="Brand profile dan AI memory builder."
      description="Semua input bisnis utama dari PRD sudah dipetakan, lengkap dengan output AI yang diharapkan."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle
            title="Brand inputs"
            description="Bentuk data yang nantinya disimpan ke tabel brands dan assets."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Company Name" value={brandProfile.companyName} />
            <Field label="Industry" value={brandProfile.industry} />
            <Field label="Target Audience" value={brandProfile.targetAudience} />
            <Field label="USP" value={brandProfile.usp} />
            <Field label="Brand Voice" value={brandProfile.brandVoice} />
            <Field label="Language" value={brandProfile.language} />
            <Field label="Location" value={brandProfile.location} />
            <Field label="Website" value={brandProfile.website} />
            <Field label="Instagram" value={brandProfile.instagram} />
            <Field label="Facebook" value={brandProfile.facebook} />
            <Field label="TikTok" value={brandProfile.tiktok} />
            <Field label="Business Description" value={brandProfile.businessDescription} />
          </div>
        </Card>

        <Card className="bg-slate-50">
          <SectionTitle
            title="AI outputs"
            description="Ringkasan hasil Brand Analyzer sebelum dipakai agent berikutnya."
          />
          <div className="grid gap-3">
            <Field label="Brand Summary" value={brandProfile.aiSummary} />
            <Field label="Brand Personality" value={brandProfile.aiPersonality} />
            <Field label="Marketing Tone" value={brandProfile.aiTone} />
            <Field label="Keywords" value={brandProfile.aiKeywords.join(", ")} />
            <Field label="Negative Prompt" value={brandProfile.aiNegativePrompt} />
            <Field
              label="Color direction"
              value={`${brandProfile.primaryColor} / ${brandProfile.secondaryColor}`}
            />
          </div>
        </Card>
      </section>
    </Shell>
  );
}
