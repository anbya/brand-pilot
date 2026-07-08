import Image from "next/image";
import Link from "next/link";

type IconName =
  | "add"
  | "analytics"
  | "assets"
  | "bolt"
  | "brands"
  | "calendar"
  | "campaign"
  | "check"
  | "chevronDown"
  | "dashboard"
  | "idea"
  | "spark"
  | "settings"
  | "trend"
  | "upload";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5LtcSEZ7F5QffQjEpFdB4p3jqD2GVDvGjOPezI4zUOYKPK6IqzRZwAMUi9xvpAiVsZ81RRy_bbmzqkzqLaGPEZoGs-LQTRXzJlojqaC6BLHrNa-iu_stwKurd_kr30Pu52GcQJ48h7mj5pEF91bwZFXHnaEZS4JFXdalOTDUX9H_X-AzbxIMa9VQG87tdkaA4g32dcXsT3FBGWsgzbIC_mqPyFjj410cbXW19irJXn_0-Q9h_HKro";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard", active: true },
  { label: "Brands", icon: "brands", href: "/brands" },
  { label: "Campaigns", icon: "campaign", href: "/campaigns" },
  { label: "Content Calendar", icon: "calendar", href: "/calendar" },
  { label: "Assets", icon: "assets", href: "/assets" },
  { label: "Analytics", icon: "analytics", href: "/analytics" },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

const metrics = [
  {
    label: "Total Campaigns",
    value: "23",
    detail: "+12% vs last month",
    icon: "campaign",
    tone: "blue",
  },
  {
    label: "Total Posts",
    value: "220",
    detail: "+8% vs last month",
    icon: "dashboard",
    tone: "blue",
  },
  {
    label: "Ready to Publish",
    value: "18",
    detail: "Across 3 brands",
    icon: "spark",
    tone: "indigo",
  },
  {
    label: "Credits Left",
    value: "158",
    detail: "65% used",
    icon: "bolt",
    tone: "red",
    progress: 65,
  },
] satisfies Array<{
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: "blue" | "indigo" | "red";
  progress?: number;
}>;

const campaigns = [
  {
    name: "July Promotion",
    dates: "Jun 1 - Jun 30, 2024",
    status: "Active",
    icon: "spark",
    progress: 80,
    color: "bg-blue-600",
    text: "text-blue-700",
  },
  {
    name: "Education Series",
    dates: "Jun 1 - Jun 20, 2024",
    status: "Planning",
    icon: "idea",
    progress: 60,
    color: "bg-indigo-600",
    text: "text-indigo-700",
  },
  {
    name: "Summer Wellness",
    dates: "Jun 10 - Jul 10, 2024",
    status: "Draft",
    icon: "check",
    progress: 15,
    color: "bg-emerald-600",
    text: "text-emerald-700",
  },
] satisfies Array<{
  name: string;
  dates: string;
  status: string;
  icon: IconName;
  progress: number;
  color: string;
  text: string;
}>;

const activities = [
  {
    title: "Instagram Reel",
    description: "published for Coffee XYZ.",
    time: "2 mins ago",
    icon: "check",
    tone: "emerald",
  },
  {
    title: "AI Draft",
    description: "created for Summer Sale.",
    time: "15 mins ago",
    icon: "campaign",
    tone: "blue",
  },
] satisfies Array<{
  title: string;
  description: string;
  time: string;
  icon: IconName;
  tone: "blue" | "emerald";
}>;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
      <DashboardSidebar />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 border-b border-[#d3e4fe] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#717786]">
              Dashboard Overview
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-[#0b1c30] sm:text-3xl">
              Good morning, Sarah!
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#414755]">
              Here&apos;s what&apos;s happening with your brands today.
            </p>
          </div>

          <button
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c1c6d7] bg-white px-4 py-2 text-sm font-semibold text-[#0b1c30] shadow-sm transition hover:border-[#0058bc]"
            type="button"
          >
            <Icon name="calendar" className="h-4 w-4 text-[#0058bc]" />
            Jun 1 - Jun 7, 2024
            <Icon name="chevronDown" className="h-4 w-4 text-[#717786]" />
          </button>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <section className="col-span-12 xl:col-span-8">
            <Panel className="overflow-hidden p-0">
              <div className="flex items-center justify-between gap-4 border-b border-[#d3e4fe]/80 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold text-[#0b1c30]">Recent Campaigns</h2>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0058bc] transition hover:text-[#004493]"
                  href="/campaigns"
                >
                  View All
                  <Icon name="add" className="h-4 w-4 rotate-45" />
                </Link>
              </div>

              <div className="grid gap-3 p-4 sm:p-6">
                {campaigns.map((campaign) => (
                  <CampaignRow key={campaign.name} campaign={campaign} />
                ))}
              </div>
            </Panel>
          </section>

          <aside className="col-span-12 grid gap-6 xl:col-span-4">
            <Panel>
              <h2 className="text-lg font-bold text-[#0b1c30]">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                <ActionButton icon="add" label="New Campaign" primary href="/campaigns" />
                <ActionButton icon="upload" label="Upload Knowledge" href="/knowledge" />
                <ActionButton icon="idea" label="AI Content Idea" href="/content" />
              </div>
            </Panel>

            <section className="rounded-lg border border-[#213145] bg-[#0b1c30] p-6 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Icon name="spark" className="h-5 w-5 text-[#6ffbbe]" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6ffbbe]">
                  AI Insight
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-[#eaf1ff]">
                Your Coffee Series is performing 40% better on Instagram. Generate
                three more reels based on its successful patterns.
              </p>
              <button
                className="mt-5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                type="button"
              >
                Apply Strategy
              </button>
            </section>

            <Panel>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#717786]">
                Latest Activity
              </h2>
              <div className="mt-4 grid gap-4">
                {activities.map((activity) => (
                  <div key={`${activity.title}-${activity.time}`} className="flex gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        activity.tone === "emerald"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <Icon name={activity.icon} className="h-4 w-4" />
                    </span>
                    <div className="text-sm leading-6 text-[#414755]">
                      <p>
                        <span className="font-bold text-[#0b1c30]">{activity.title}</span>{" "}
                        {activity.description}
                      </p>
                      <p className="text-xs font-semibold text-[#717786]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </div>

      <Link
        aria-label="Quick Start Campaign"
        className="fixed bottom-6 right-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-[#0058bc] text-white shadow-lg transition hover:bg-[#004493] lg:flex"
        href="/campaigns"
      >
        <Icon name="add" className="h-6 w-6" />
      </Link>
    </main>
  );
}

function DashboardSidebar() {
  return (
    <aside className="border-b border-[#d3e4fe] bg-white lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:p-4">
        <Link className="flex items-center gap-3" href="/dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0058bc] text-white">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-[#0058bc]">
              AI Marketing OS
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#717786]">
              Enterprise Suite
            </span>
          </span>
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-lg bg-[#4648d4] px-3 py-2 text-xs font-bold text-white lg:hidden"
          href="/campaigns"
        >
          <Icon name="add" className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
              item.active
                ? "bg-[#0070eb] text-white"
                : "text-[#414755] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
            }`}
            href={item.href}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-[#d3e4fe] p-4 lg:block">
        <Link
          className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#393bb8]"
          href="/campaigns"
        >
          <Icon name="add" className="h-5 w-5" />
          New Campaign
        </Link>
        <Link
          className="mb-4 inline-flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff]"
          href="/settings"
        >
          <Icon name="settings" className="h-5 w-5" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-[#eff4ff] p-2">
          <Image
            src={profileImage}
            width={40}
            height={40}
            alt="Sarah Jenkins profile"
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#0b1c30]">Sarah Jenkins</p>
            <p className="truncate text-xs font-semibold text-[#717786]">Admin</p>
          </div>
          <Icon name="chevronDown" className="h-4 w-4 text-[#717786]" />
        </div>
      </div>
    </aside>
  );
}

function MetricCard({
  metric,
}: {
  metric: (typeof metrics)[number];
}) {
  const toneClass = {
    blue: "bg-[#e5eeff] text-[#0058bc]",
    indigo: "bg-[#e1e0ff] text-[#4648d4]",
    red: "bg-red-50 text-red-700",
  }[metric.tone];

  return (
    <Panel className="flex min-h-[172px] flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold text-[#717786]">{metric.label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon name={metric.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5">
        <p className="text-4xl font-extrabold leading-none text-[#0b1c30]">{metric.value}</p>
        {metric.progress ? (
          <>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
              <div className="h-full rounded-full bg-[#0058bc]" style={{ width: `${metric.progress}%` }} />
            </div>
            <p className="mt-2 text-right text-xs font-semibold text-[#717786]">{metric.detail}</p>
          </>
        ) : (
          <p
            className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${
              metric.tone === "indigo" ? "text-[#717786]" : "text-emerald-700"
            }`}
          >
            {metric.tone !== "indigo" && <Icon name="trend" className="h-4 w-4" />}
            {metric.detail}
          </p>
        )}
      </div>
    </Panel>
  );
}

function CampaignRow({ campaign }: { campaign: (typeof campaigns)[number] }) {
  return (
    <article className="grid gap-4 rounded-lg border border-transparent p-4 transition hover:border-[#d3e4fe] hover:bg-[#f8f9ff] sm:grid-cols-[64px_1fr]">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#e5eeff]">
        <Icon name={campaign.icon} className={`h-7 w-7 ${campaign.text}`} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0b1c30]">{campaign.name}</h3>
            <p className="mt-1 text-xs font-semibold text-[#717786]">{campaign.dates}</p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
              campaign.status === "Active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-[#e5eeff] text-[#414755]"
            }`}
          >
            {campaign.status}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5eeff]">
            <div className={`h-full rounded-full ${campaign.color}`} style={{ width: `${campaign.progress}%` }} />
          </div>
          <span className={`text-sm font-extrabold ${campaign.text}`}>{campaign.progress}%</span>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  href,
  icon,
  label,
  primary = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      className={`inline-flex items-center gap-3 rounded-lg border px-4 py-4 text-sm font-bold transition ${
        primary
          ? "border-[#0058bc] bg-[#0058bc] text-white hover:bg-[#004493]"
          : "border-[#d3e4fe] bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]"
      }`}
      href={href}
    >
      <Icon name={icon} className={`h-5 w-5 ${primary ? "text-white" : "text-[#0058bc]"}`} />
      {label}
    </Link>
  );
}

function Panel({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section className={`rounded-lg border border-[#d3e4fe]/80 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    add: <path d="M12 5v14M5 12h14" />,
    analytics: <path d="M4 19V5M9 19V9M14 19v-6M19 19V7" />,
    assets: <path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    bolt: <path d="m13 2-7 12h5l-1 8 8-13h-5l0-7Z" />,
    brands: <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" />,
    calendar: <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    campaign: <path d="M4 13V7l10-3v14L4 15v-2Zm10-3h3a3 3 0 0 1 0 6h-3M7 15l2 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    idea: <path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2Z" />,
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />,
    trend: <path d="m4 16 6-6 4 4 6-7M15 7h5v5" />,
    upload: <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
