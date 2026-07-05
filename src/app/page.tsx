import {
  AppFrame,
  Card,
  MockArtCard,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
  Shell,
} from "@/components/brandpilot";

const flowCards = [
  ["Landing", "Marketing page dengan CTA ke workspace."],
  ["Login", "Masuk ke akun dan buka AI workspace."],
  ["Onboarding", "Buat workspace, pilih industri, isi brand info."],
  ["Dashboard", "Pantau campaign, progress, dan quick actions."],
  ["Brand Brain", "Lihat memory brand, tone, prompt, dan knowledge base."],
  ["Campaign", "Generate blueprint campaign dan content calendar."],
  ["Editor", "Ubah content output dan mock canvas design."],
  ["Render + Library", "Queue asset, review hasil, dan simpan library."],
  ["Schedule", "Atur publish date dan preview post."],
  ["Analytics", "Pantau performa konten."],
  ["Team + Settings", "Kelola anggota dan workspace profile."],
  ["Pricing", "Arahkan upgrade plan."],
] as const;

export default function Home() {
  return (
    <Shell
      eyebrow="AI Marketing OS"
      title="Complete user flow untuk AI marketing workspace."
      description="Tampilan dan struktur halaman diubah mengikuti referensi: landing minimal, onboarding bertahap, dashboard dengan sidebar, content workflow, asset pipeline, scheduling, analytics, team, settings, dan pricing."
      actions={
        <>
          <PrimaryButton href="/auth/login">Start Free Trial</PrimaryButton>
          <SecondaryButton href="/dashboard">Watch Demo</SecondaryButton>
        </>
      }
    >
      <MockArtCard title="Your AI Marketing Team, All in One Platform" subtitle="Landing Page" />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionTitle
            title="Reference flow implemented"
            description="Urutan halaman mengikuti struktur utama pada gambar."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {flowCards.map(([title, description], index) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </Card>

        <AppFrame title="Dashboard Preview">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Generated Content</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">220</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Ready to Publish</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">18</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">Recent Campaigns</p>
                  <p className="text-xs text-violet-600">View all</p>
                </div>
                <div className="mt-4 space-y-3">
                  {[72, 48, 91].map((value, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                        <span>Campaign {index + 1}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">Quick Actions</p>
              <div className="mt-4 grid gap-3">
                {["New Campaign", "Brand Audit", "Generate Assets", "Schedule Posts"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </AppFrame>
      </section>
    </Shell>
  );
}
