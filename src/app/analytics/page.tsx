import Image from "next/image";
import Link from "next/link";

type IconName =
  | "add"
  | "analytics"
  | "assets"
  | "brands"
  | "calendar"
  | "campaign"
  | "check"
  | "chevronDown"
  | "click"
  | "conversion"
  | "dashboard"
  | "download"
  | "group"
  | "money"
  | "settings"
  | "trendDown"
  | "trendUp";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5LtcSEZ7F5QffQjEpFdB4p3jqD2GVDvGjOPezI4zUOYKPK6IqzRZwAMUi9xvpAiVsZ81RRy_bbmzqkzqLaGPEZoGs-LQTRXzJlojqaC6BLHrNa-iu_stwKurd_kr30Pu52GcQJ48h7mj5pEF91bwZFXHnaEZS4JFXdalOTDUX9H_X-AzbxIMa9VQG87tdkaA4g32dcXsT3FBGWsgzbIC_mqPyFjj410cbXW19irJXn_0-Q9h_HKro";

const contentRows = [
  {
    name: "Summer Promo v2",
    channel: "Instagram",
    channelClass: "text-[#0058bc]",
    impressions: "124,500",
    engagement: "8.42%",
    likes: "12.2k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpXyE2w5QT-sfgJos5S4BvC8dODiMhYlRSFfks2_8OzPzNDtHN8WKX0FUXh8PdgKwthX6i6BuzsUAaUK3lgtsVsMZ7BXtSzaknULCOxxMsn9WvFTuGMrvEZQbZVfAoELu7JM6jX-Oksb8TzOj20eLVKMm38qnqPV-iEk5e2sBkUJkoZzsJRLJWyUR_bOfPa8OGfVm5CXJKZ_r_yKArz6yeRTeWZ_r273IpD3YUP4rCPq-vpsXksngR",
  },
  {
    name: "Enterprise Explainer",
    channel: "LinkedIn",
    channelClass: "text-[#4648d4]",
    impressions: "86,200",
    engagement: "6.15%",
    likes: "5.8k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChjvC3GZm0zTQHnWYtWaFFIioJftSnUCnuLzEFQQTuIp5VbHlS9b4x2pOuASks30AxsT2Oh_XAp1sR8jDQoSqAHdpRlTcy9FV-LaRSnG7Uch6glyOlv2d3ytu8-UcOo6NR2fallZ5AfOCxr_Ms2ic-jSGzQmJrp8df4_YBCh50YhP0EZwmgIvVGAazar1r1XFmFvGKTf4_IgjQejlWDFV5bd78XKlJ5YrFycjbryjGgdUYlwFWFBvs",
  },
  {
    name: "User Story #12",
    channel: "TikTok",
    channelClass: "text-[#ba1a1a]",
    impressions: "312,000",
    engagement: "12.1%",
    likes: "45.3k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcsWAvhpIt4U_FK9xJ5YAPfOw5nN6PTecRyHLD9QDDPscTutH9h_qGDN5HvQvLzjIpRQ406kWczDyllzjoBXQ8fcZ3hwdkQdezfU4i5WeSIUzeMZddF7z0awX9RCKPIStTKFIct-uc7uZZViOkqRalPONbxX7rcwPWALdwuo5z6myI8TWt3kS30N3o8Gr3PrffdJJJXGi46UDqYqHtE4kFQoMlhcbXU8FTUD75FEfe_Q8zwgBlhkgO",
  },
] as const;

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Brands", icon: "brands", href: "/brands" },
  { label: "Campaigns", icon: "campaign", href: "/campaigns" },
  { label: "Content Calendar", icon: "calendar", href: "/calendar" },
  { label: "Assets", icon: "assets", href: "/assets" },
  { label: "Analytics", icon: "analytics", href: "/analytics", active: true },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

const stats = [
  { label: "Total Clicks", value: "42,892", delta: "12.5%", icon: "click", tone: "blue" },
  { label: "Conversion Rate", value: "3.82%", delta: "4.2%", icon: "conversion", tone: "indigo" },
  { label: "ROI", value: "4.2x", delta: "28.1%", icon: "money", tone: "green" },
  { label: "Reach", value: "1.2M", delta: "0.5%", icon: "group", tone: "red", down: true },
] satisfies Array<{
  label: string;
  value: string;
  delta: string;
  icon: IconName;
  tone: "blue" | "indigo" | "green" | "red";
  down?: boolean;
}>;

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
      <AnalyticsSidebar />

      <section className="mx-auto min-h-screen w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0b1c30]">Analytics Performance</h1>
            <p className="mt-2 text-sm leading-6 text-[#414755]">
              Real-time insights across all active campaigns and generative assets.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex rounded-lg bg-[#e5eeff] p-1">
              <button className="rounded-md bg-white px-4 py-1.5 text-sm font-bold text-[#0058bc] shadow-sm" type="button">
                7 Days
              </button>
              <button className="rounded-md px-4 py-1.5 text-sm font-bold text-[#414755]" type="button">
                30 Days
              </button>
              <button className="rounded-md px-4 py-1.5 text-sm font-bold text-[#414755]" type="button">
                All Time
              </button>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[#0058bc] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#004493]"
              type="button"
            >
              <Icon name="download" className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnalyticsCard className="lg:col-span-2">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b1c30]">Reach & Engagement</h2>
                <p className="mt-1 text-sm text-[#414755]">Daily breakdown of audience interaction</p>
              </div>
              <div className="flex items-center gap-4">
                <Legend color="bg-[#0058bc]" label="Reach" />
                <Legend color="bg-[#4648d4]" label="Engagement" />
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-lg bg-[#f8f9ff] p-4">
              <svg className="absolute inset-4 h-[calc(100%-48px)] w-[calc(100%-32px)]" preserveAspectRatio="none" viewBox="0 0 800 240">
                <path d="M0,200 Q100,150 200,180 T400,100 T600,140 T800,50" fill="none" stroke="#0058bc" strokeLinecap="round" strokeWidth="4" />
                <path d="M0,220 Q100,200 200,210 T400,180 T600,190 T800,150" fill="none" stroke="#4648d4" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between text-xs font-semibold text-[#717786]">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </AnalyticsCard>

          <AnalyticsCard>
            <h2 className="text-xl font-bold text-[#0b1c30]">Campaign Distribution</h2>
            <p className="mt-1 text-sm text-[#414755]">Budget vs Performance per channel</p>
            <div className="mt-6 grid gap-6">
              <ChannelBar label="Instagram" value={45} color="bg-[#0058bc]" />
              <ChannelBar label="LinkedIn" value={28} color="bg-[#4648d4]" />
              <ChannelBar label="TikTok" value={15} color="bg-[#006947]" />
              <ChannelBar label="Meta Ads" value={12} color="bg-[#717786]" />
            </div>
            <button
              className="mt-6 w-full rounded-lg border border-[#c1c6d7] px-4 py-3 text-sm font-bold text-[#0b1c30] transition hover:bg-[#eff4ff]"
              type="button"
            >
              View Channels Breakdown
            </button>
          </AnalyticsCard>
        </section>

        <AnalyticsCard>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0b1c30]">Top Performing Content</h2>
              <p className="mt-1 text-sm text-[#414755]">Assets sorted by engagement effectiveness</p>
            </div>
            <div className="flex gap-2">
              {["Image", "Video"].map((filter) => (
                <button key={filter} className="rounded-md bg-[#e5eeff] px-3 py-1.5 text-xs font-bold text-[#414755]" type="button">
                  {filter}
                </button>
              ))}
              <button className="rounded-md bg-[#0058bc] px-3 py-1.5 text-xs font-bold text-white" type="button">
                All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-[#c1c6d7]">
                  {["Asset Name", "Channel", "Impressions", "Engagement Rate", "Likes", "Trend"].map((header) => (
                    <th key={header} className="px-2 pb-4 text-sm font-bold text-[#414755]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3e4fe]">
                {contentRows.map((row) => (
                  <tr key={row.name} className="transition hover:bg-[#eff4ff]">
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={row.image}
                          width={40}
                          height={40}
                          alt={`${row.name} thumbnail`}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <span className="font-bold text-[#0b1c30]">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className={`rounded-full bg-[#e5eeff] px-2 py-1 text-xs font-bold ${row.channelClass}`}>
                        {row.channel}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-sm font-semibold">{row.impressions}</td>
                    <td className="px-2 py-4 text-sm font-semibold">{row.engagement}</td>
                    <td className="px-2 py-4 text-sm font-semibold">{row.likes}</td>
                    <td className="px-2 py-4">
                      <Icon name="trendUp" className="h-5 w-5 text-[#006947]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnalyticsCard>
      </section>
    </main>
  );
}

function AnalyticsSidebar() {
  return (
    <aside className="border-b border-[#d3e4fe] bg-white lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:p-4">
        <Link className="flex items-center gap-3" href="/dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0058bc] text-white">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-[#0058bc]">AI Marketing OS</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#717786]">
              Enterprise Suite
            </span>
          </span>
        </Link>
        <Link className="inline-flex items-center gap-2 rounded-lg bg-[#4648d4] px-3 py-2 text-xs font-bold text-white lg:hidden" href="/campaigns">
          <Icon name="add" className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
              item.active ? "bg-[#0070eb] text-white" : "text-[#414755] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
            }`}
            href={item.href}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-[#d3e4fe] p-4 lg:block">
        <Link className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#393bb8]" href="/campaigns">
          <Icon name="add" className="h-5 w-5" />
          New Campaign
        </Link>
        <Link className="mb-4 inline-flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff]" href="/settings">
          <Icon name="settings" className="h-5 w-5" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-[#eff4ff] p-2">
          <Image src={profileImage} width={40} height={40} alt="Sarah Jenkins profile" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
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

function AnalyticsCard({ children, className = "" }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <section className={`rounded-lg border border-[#d3e4fe]/70 bg-white p-6 shadow-sm ${className}`}>{children}</section>;
}

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const toneClass = {
    blue: "bg-[#d8e2ff] text-[#0058bc]",
    indigo: "bg-[#e1e0ff] text-[#4648d4]",
    green: "bg-[#6ffbbe] text-[#006947]",
    red: "bg-[#ffdad6] text-[#ba1a1a]",
  }[stat.tone];

  return (
    <AnalyticsCard>
      <div className="mb-4 flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon name={stat.icon} className="h-5 w-5" />
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${stat.down ? "text-[#ba1a1a]" : "text-[#006947]"}`}>
          <Icon name={stat.down ? "trendDown" : "trendUp"} className="h-4 w-4" />
          {stat.delta}
        </span>
      </div>
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#414755]">{stat.label}</p>
      <p className="mt-1 text-4xl font-extrabold text-[#0b1c30]">{stat.value}</p>
    </AnalyticsCard>
  );
}

function ChannelBar({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span className="text-[#0058bc]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e5eeff]">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-xs font-semibold text-[#414755]">{label}</span>
    </span>
  );
}

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    add: <path d="M12 5v14M5 12h14" />,
    analytics: <path d="M4 19V5M9 19V9M14 19v-6M19 19V7" />,
    assets: <path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    brands: <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" />,
    calendar: <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    campaign: <path d="M4 13V7l10-3v14L4 15v-2Zm10-3h3a3 3 0 0 1 0 6h-3M7 15l2 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    click: <path d="M8 13 3 8l5-5M3 8h13a5 5 0 0 1 0 10h-2" />,
    conversion: <path d="M4 7h10l-3-3M14 17H4l3 3M20 8v8a2 2 0 0 1-2 2h-4M4 8v8" />,
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    download: <path d="M12 4v10M7 9l5 5 5-5M4 20h16" />,
    group: <path d="M16 11a4 4 0 1 0-8 0M3 20a6 6 0 0 1 12 0M17 20a5 5 0 0 0-4-4.9M17 7a3 3 0 1 1 0 6" />,
    money: <path d="M4 7h16v10H4zM8 12h.01M16 12h.01M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    trendDown: <path d="m4 8 6 6 4-4 6 7M15 17h5v-5" />,
    trendUp: <path d="m4 16 6-6 4 4 6-7M15 7h5v5" />,
  };

  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}
