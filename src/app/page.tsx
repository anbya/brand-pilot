import Image from "next/image";
import Link from "next/link";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJVdpDsfj5vd2FcxTPMC2q2ua4toLMgTVRtn7hlXWaiDroPyWWUqJR88s2VxAJS5HS2N2LIs7iiEbrX2NcNfsCfJqI5-ixhXb8u-EvQkK9Bx1P_pHGOMqXIrt4pXcv0B33q4vAI5zOBnoHpZPDmuHVSk6fJcHJwjzRNkryAN9481paxdbXM2k64Twa7POSmfmYXDQ_405XvY3zspvZ6e2xs4PVf6AKcxmtIPSB7KahZ2b_DhV4BiM0";

const brandBrainImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDULEMB2JwloIj-syiVLPOJa546H6Dc5xGM2m2tehr1QN_yYwD7sWQfhr17xUMfNnocbCYaBnx1ViGqCd2VT3NrEpvNuofzdYAuPi8oTOm6fz67tO44JnW19wEqkzaP7YGG4v9_wNn9Y4QjP8h8Z-EdQXtEShNkgLptwn63WPNWS-GV-MfXNGRRrUd6dEG99nrvp_BX8Ix8MSKauXBMn9pSD-_6K0QUUt4tBeqBfb4DpTjlQNhT8Ie";

const studioImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAmGbgj_H8jYNB9Z67X4uO5piTcIlDcV5zDWD39ryg0bPT0kpUhct1pAM7crw6viWLamrwUaIyfeSdCyFlmKUHs6Wc8vXCRxqkeSbreWdO3xZTq0s5Ed1R4FBGevX6q6NoxsjdcObHq2uFZWgWojGWjXL4BLWutVr-If8Beh1jmXAgceWPqO8G5nraIy4gPaCuG0aJ9ayOjH0fUMqB-_MD8w9fOrMYSaET_9lWPQ316jNg5S97XZQgc";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9nrmV_qwxsse5vihKs0-qB6m1fYK9HY2tfZzPf8olGA0R0J3lhLGrae1kp_HpxomgzEdST_ZNqH5ErFSJDUdzf0L8To9tZOwEks9EbbuzajPorI0RRwgHEUyHqDaxt3T4XWBakkvRUiWbG0sIqolRBznlwpSRHleeIKNzY8RACl0S-3MF8SXs-Z-HkDvQVflzAUM9YiY_YGJ94Q9_aoGcfuTsVIkvsyELnZJYPK9D847PQxt1tlrj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDRdMvDWY65IYv_Ri4eACYsKMgjoPOUR_tQ0fORhIl0AY9k9BwtzdfePdYokPARR8oadP6fZzAhmWqENe_WlXD6d8lMlHoe5CJxqR7h0Ab9YfjeRoZsmOxv-1HZcaPJOz82dvrIIHxogBN82ZMuMP6-S7Qj7bVeA9zWSjClzIDr4A0y2p3TU_B-CE10Mwvi98GpFtl_qRdMCQIGB6Q7eoWikbmx_4tSOF6i_GekgOu1ET3o9VmL4ALc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBIf-9T9CaNc4R5T0A_d1-rlv5UYVVagzIK12ftJXxkA7-IdmkZ68iDMs_y7axAQGW6rzT1PHZyXzkmAkGVF4396yD51A_XXyIWme9PwrcXzgSas_f7huUxCHD7MKlE52ul7fg-GcJFPYYOdFb5XPGHFz_vFnAKWNe5a2f8Wo3TO6oxGuSVYFs8FIzQaBm86iOHeehyiUYHK7oW93Pf-HTEBR-YddTjeGNcRJv9u1mSdJkCF5e-MBZ",
] as const;

const logos = ["Northstar", "Orbit", "Lumina", "Kanvas", "Metric", "Vertex"];

const features = [
  {
    title: "Multi-Channel Campaigns",
    description: "Generate blueprints for email, social, and search campaigns in minutes.",
    label: "CM",
  },
  {
    title: "Smart Calendar",
    description: "Plan every post with clear scheduling, approvals, and publishing status.",
    label: "SC",
  },
  {
    title: "Asset Pipeline",
    description: "Move captions, images, and videos from draft to ready-to-publish faster.",
    label: "AP",
  },
] as const;

const metrics = [
  ["TOTAL REACH", "124.5K", "+12% vs last month"],
  ["ENGAGEMENT", "8.7K", "+5% vs last month"],
  ["CONVERSIONS", "2.3K", "+15% vs last month"],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <LandingNav />
      <HeroSection />
      <LogoSection />
      <FeatureSection />
      <DashboardPreview />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}

function LandingNav() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-bold text-slate-950">
          AI Marketing OS
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link className="text-sm font-semibold text-blue-600" href="#product">
            Product
          </Link>
          <Link className="text-sm font-medium text-slate-600 transition hover:text-blue-600" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium text-slate-600 transition hover:text-blue-600" href="#resources">
            Resources
          </Link>
          <Link className="text-sm font-medium text-slate-600 transition hover:text-blue-600" href="/auth/login">
            Login
          </Link>
        </nav>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Get Started Free
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="pt-28">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase text-blue-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              AI
            </span>
            New: AI Video Campaigns
          </div>
          <h1 className="mt-7 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Your AI Marketing Team All In One Platform
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 lg:mx-0">
            Plan, create, and publish content faster with AI. A focused operating system
            for modern marketing teams to scale growth without complexity.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/auth/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              <span className="text-blue-600">Play</span>
              Watch Demo
            </Link>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <div className="flex -space-x-3">
              {avatars.map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  width={40}
                  height={40}
                  alt={`Marketing leader ${index + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500">
              Trusted by <span className="font-bold text-slate-950">10,000+</span>{" "}
              marketing teams
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <Image
              src={heroImage}
              width={1040}
              height={760}
              alt="AI marketing dashboard with campaign performance widgets and content previews"
              preload
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute -right-3 top-5 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:block">
            <p className="text-xs font-semibold uppercase text-slate-500">ROI Increased</p>
            <p className="mt-1 text-xl font-bold text-emerald-600">+124%</p>
          </div>
          <div className="absolute -bottom-4 left-4 hidden w-52 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:block">
            <p className="text-sm font-semibold text-slate-900">AI Draft Ready</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-2 w-3/4 rounded-full bg-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Empowering brands globally
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="product" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-950">Unified AI Workflow</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Everything you need to run a high-performance marketing department,
            powered by AI agents that understand your brand.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-8">
            <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
              <div>
                <IconLabel>BB</IconLabel>
                <h3 className="mt-5 text-2xl font-bold text-slate-950">
                  Strategic Brand Brain
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Train the workspace on your brand voice, guidelines, and assets so
                  every output stays aligned from first draft to final post.
                </p>
                <Link
                  href="/brain"
                  className="mt-6 inline-flex text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  Learn more
                </Link>
              </div>
              <Image
                src={brandBrainImage}
                width={680}
                height={520}
                alt="Digital brain visualization for brand intelligence"
                className="h-full min-h-64 w-full rounded-lg object-cover"
              />
            </div>
          </article>

          <div className="grid gap-6 md:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <IconLabel>{feature.label}</IconLabel>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          <article className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-6 text-white shadow-sm lg:col-span-12">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <IconLabel dark>ST</IconLabel>
                <h3 className="mt-5 text-2xl font-bold">Content Creation Engine</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  From carousel posts to campaign copy, generate ready-to-review assets
                  in one clear studio workflow.
                </p>
                <Link
                  href="/editor"
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Try the Studio
                </Link>
              </div>
              <Image
                src={studioImage}
                width={760}
                height={440}
                alt="Social media content cards generated by an AI studio"
                className="h-72 w-full rounded-lg object-cover"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-950">
            From Idea to Campaign in 3 Clicks
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Replace disconnected tools with one calm workspace for campaigns, assets,
            scheduling, and analytics.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border-[10px] border-slate-950 bg-white shadow-sm">
          <div className="grid min-h-[540px] md:grid-cols-[240px_1fr]">
            <aside className="hidden border-r border-slate-200 bg-slate-50 p-6 md:block">
              <p className="font-bold text-blue-600">AI Marketing OS</p>
              <div className="mt-8 space-y-2">
                {["Dashboard", "Brands", "Campaigns", "Analytics"].map((item, index) => (
                  <div
                    key={item}
                    className={
                      index === 0
                        ? "rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                        : "rounded-lg px-4 py-3 text-sm font-medium text-slate-500"
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-2xl font-bold text-slate-950">Welcome back, Sarah</h3>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  New Campaign
                </Link>
              </div>
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {metrics.map(([label, value, hint]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-5 text-3xl font-bold text-slate-950">{value}</p>
                    <p className="mt-5 text-xs font-bold text-emerald-600">{hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-bold text-slate-950">Recent AI Generations</p>
                <div className="mt-5 space-y-3">
                  <GenerationRow
                    title="Summer Promotion Ad Set"
                    meta="Generated 2h ago - 4 assets"
                    label="IMG"
                  />
                  <GenerationRow
                    title="Coffee XYZ Brand Script"
                    meta="Generated 5h ago - 1 file"
                    label="TXT"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            Ready to automate your marketing success?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100">
            Join high-growth brands using AI Marketing OS to keep strategy, content,
            and execution in one place.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Start Free Trial
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer id="resources" className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-bold text-slate-950">AI Marketing OS</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The operating system for modern marketing teams.
          </p>
        </div>
        <FooterLinks title="Product" items={["Features", "Integrations", "Pricing", "Roadmap"]} />
        <FooterLinks title="Company" items={["About Us", "Careers", "Press", "Contact"]} />
        <div>
          <p className="text-sm font-bold text-slate-950">Newsletter</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Get the latest AI marketing tips delivered to your inbox.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="Email"
              type="email"
            />
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-200 px-4 pt-8 text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8">
        <p>Copyright 2026 AI Marketing OS. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="#" className="transition hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="#" className="transition hover:text-blue-600">
            Terms of Service
          </Link>
          <Link href="#" className="transition hover:text-blue-600">
            Cookie Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}

function IconLabel({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return (
    <span
      className={
        dark
          ? "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white"
          : "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600"
      }
    >
      {children}
    </span>
  );
}

function GenerationRow({
  title,
  meta,
  label,
}: {
  title: string;
  meta: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg p-3 transition hover:bg-slate-50">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
        {label}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{title}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{meta}</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
        READY
      </span>
    </div>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="transition hover:text-blue-600">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
