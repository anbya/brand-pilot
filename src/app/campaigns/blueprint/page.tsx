import Image from "next/image";
import Link from "next/link";
import { CampaignAssetMap, type CampaignAssetRow } from "@/components/campaign-asset-map";

type IconName =
  | "add"
  | "analytics"
  | "assets"
  | "brands"
  | "calendar"
  | "campaign"
  | "carousel"
  | "check"
  | "chevronDown"
  | "chevronRight"
  | "dashboard"
  | "edit"
  | "layers"
  | "lightbulb"
  | "movie"
  | "poll"
  | "post"
  | "settings"
  | "spark";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5LtcSEZ7F5QffQjEpFdB4p3jqD2GVDvGjOPezI4zUOYKPK6IqzRZwAMUi9xvpAiVsZ81RRy_bbmzqkzqLaGPEZoGs-LQTRXzJlojqaC6BLHrNa-iu_stwKurd_kr30Pu52GcQJ48h7mj5pEF91bwZFXHnaEZS4JFXdalOTDUX9H_X-AzbxIMa9VQG87tdkaA4g32dcXsT3FBGWsgzbIC_mqPyFjj410cbXW19irJXn_0-Q9h_HKro";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Brands", icon: "brands", href: "/brands" },
  { label: "Campaigns", icon: "campaign", href: "/campaigns", active: true },
  { label: "Content Calendar", icon: "calendar", href: "/calendar" },
  { label: "Analytics", icon: "analytics", href: "/analytics" },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

type CampaignBlueprint = {
  name: string;
  primaryObjective: string;
  targetPlatforms: string[];
  toneOfVoice: string[];
  startDate: string;
  endDate: string;
};

type AssetRow = CampaignAssetRow & { icon: IconName };

const defaultCampaign: CampaignBlueprint = {
  name: "July Awareness",
  primaryObjective: "Brand Awareness & Engagement",
  targetPlatforms: ["Instagram", "TikTok", "LinkedIn"],
  toneOfVoice: ["Visionary", "Reliable", "Professional"],
  startDate: "2026-07-01",
  endDate: "2026-07-30",
};

export default async function CampaignBlueprintPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const campaign = parseCampaign(await searchParams);
  const assetRows = buildAssetRows(campaign);
  const durationDays = getDurationDays(campaign.startDate, campaign.endDate);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
      <CampaignSidebar />

      <section className="mx-auto min-h-screen w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#717786]">
              <span>Campaigns</span>
              <Icon name="chevronRight" className="h-4 w-4" />
              <span className="text-[#0b1c30]">{campaign.name}</span>
            </nav>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0b1c30] sm:text-5xl">
              Campaign Blueprint
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#414755] sm:text-base">
              AI has generated your {durationDays}-day strategy. Review the asset sequence
              and hit Generate All to begin the rendering process.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-lg border border-[#c1c6d7] bg-white px-5 py-3 text-sm font-bold text-[#0b1c30] transition hover:bg-[#eff4ff]"
              href="/campaigns"
            >
              <Icon name="edit" className="h-4 w-4" />
              Edit Strategy
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[#0058bc] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#004493]"
              type="button"
            >
              <Icon name="spark" className="h-4 w-4" />
              Generate All Assets
            </button>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-12 gap-6">
          <section className="col-span-12 rounded-lg border border-[#d3e4fe]/70 bg-white p-6 shadow-sm lg:col-span-4">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#0b1c30]">Strategy Specs</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Optimized
              </span>
            </div>

            <div className="grid gap-6">
              <SpecBlock label="Primary Objective">
                <p className="text-base font-bold text-[#0b1c30]">{campaign.primaryObjective}</p>
              </SpecBlock>

              <SpecBlock label="Target Platforms">
                <div className="flex flex-wrap gap-2">
                  {campaign.targetPlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#eff4ff] px-3 py-2 text-xs font-bold text-[#0058bc]"
                    >
                      <Icon name={platformIcon(platform)} className="h-4 w-4" />
                      {platform}
                    </span>
                  ))}
                </div>
              </SpecBlock>

              <SpecBlock label="Tone of Voice">
                <div className="flex flex-wrap gap-2">
                  {campaign.toneOfVoice.map((tone) => (
                    <span
                      key={tone}
                      className="rounded-md bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#414755]"
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </SpecBlock>

              <SpecBlock label="Campaign Period">
                <p className="text-sm font-bold text-[#0b1c30]">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </p>
              </SpecBlock>

              <div className="rounded-lg border border-[#e1e0ff] bg-[#f5f4ff] p-4">
                <div className="flex items-start gap-3">
                  <Icon name="lightbulb" className="mt-1 h-5 w-5 shrink-0 text-[#4648d4]" />
                  <div>
                    <p className="text-sm font-extrabold text-[#4648d4]">AI Insight</p>
                    <p className="mt-1 text-sm leading-6 text-[#414755]">
                      Based on current trends, {campaign.targetPlatforms[0]} assets with a{" "}
                      {campaign.toneOfVoice[0]} voice are prioritized for the first week.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 overflow-hidden rounded-lg border border-[#d3e4fe]/70 bg-white shadow-sm lg:col-span-8">
            <div className="flex flex-col gap-4 border-b border-[#d3e4fe]/70 bg-white px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <h2 className="text-xl font-bold text-[#0b1c30]">Content Asset Map</h2>
                <div className="flex rounded-lg bg-[#eff4ff] p-1">
                  <button
                    className="rounded-md bg-[#0070eb] px-4 py-1.5 text-xs font-bold text-white"
                    type="button"
                  >
                    List View
                  </button>
                  <button
                    className="rounded-md px-4 py-1.5 text-xs font-bold text-[#414755] transition hover:bg-white"
                    type="button"
                  >
                    Calendar View
                  </button>
                </div>
              </div>
              <label className="flex w-fit items-center gap-2 text-sm font-semibold text-[#717786]">
                Filter:
                <select className="rounded-lg border border-[#d3e4fe] bg-white px-3 py-2 text-sm font-bold text-[#0b1c30] outline-none focus:border-[#0058bc]">
                  <option>All Stages</option>
                  <option>Blueprints</option>
                  <option>Generating</option>
                  <option>Ready</option>
                </select>
              </label>
            </div>

            <CampaignAssetMap initialRows={assetRows} />
          </section>

          <section className="col-span-12 rounded-lg border border-[#d3e4fe]/70 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e1e0ff] text-[#4648d4]">
                  <Icon name="spark" className="h-8 w-8" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30]">
                    Ready to bring your blueprint to life?
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#414755]">
                    Our AI will use your brand guidelines, selected platforms, and campaign
                    dates to generate assets for {campaign.targetPlatforms.join(", ")}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <div className="hidden text-right sm:block">
                  <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#717786]">
                    Estimated Time
                  </p>
                  <p className="text-base font-extrabold text-[#0b1c30]">~14 Minutes</p>
                </div>
                <span className="hidden h-12 w-px bg-[#c1c6d7] sm:block" />
                <button
                  className="rounded-lg bg-[#0058bc] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#004493]"
                  type="button"
                >
                  Start Batch Generation
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function parseCampaign(searchParams: Record<string, string | string[] | undefined>): CampaignBlueprint {
  return {
    name: getSearchValue(searchParams.name, defaultCampaign.name),
    primaryObjective: getSearchValue(searchParams.objective, defaultCampaign.primaryObjective),
    targetPlatforms: getSearchList(searchParams.platforms, defaultCampaign.targetPlatforms),
    toneOfVoice: getSearchList(searchParams.tone, defaultCampaign.toneOfVoice),
    startDate: getSearchValue(searchParams.start, defaultCampaign.startDate),
    endDate: getSearchValue(searchParams.end, defaultCampaign.endDate),
  };
}

function getSearchValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value || fallback;
}

function getSearchList(value: string | string[] | undefined, fallback: string[]) {
  const raw = getSearchValue(value, fallback.join(","));
  const items = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function buildAssetRows(campaign: CampaignBlueprint): AssetRow[] {
  const startDate = new Date(`${campaign.startDate}T00:00:00`);
  const topics = topicsForObjective(campaign.primaryObjective);
  const firstPlatform = campaign.targetPlatforms[0] ?? "Instagram";

  const initialRows: AssetRow[] = [
    {
      day: "Day 1",
      date: formatScheduleDate(startDate),
      type: `${firstPlatform} Education Carousel`,
      topic: topics[0],
      status: "BLUEPRINT",
      action: "View Details",
      icon: "carousel",
    },
    {
      day: "Day 3",
      date: formatScheduleDate(addDays(startDate, 2)),
      type: "Awareness Reel",
      topic: topics[1],
      status: "GENERATING",
      action: "Track",
      icon: "movie",
    },
    {
      day: "Day 5",
      date: formatScheduleDate(addDays(startDate, 4)),
      type: "Insight Post",
      topic: topics[2],
      status: "READY",
      action: "Preview",
      icon: "post",
    },
    {
      day: "Day 7",
      date: formatScheduleDate(addDays(startDate, 6)),
      type: "Poll Story",
      topic: topics[3],
      status: "BLUEPRINT",
      action: "View Details",
      icon: "poll",
    },
    {
      day: "Day 10",
      date: formatScheduleDate(addDays(startDate, 9)),
      type: "Case Study",
      topic: topics[4],
      status: "BLUEPRINT",
      action: "View Details",
      icon: "carousel",
    },
  ];

  const additionalTopics = [
    "Behind the scenes: how the team works",
    "Three practical tips your audience can use today",
    "Customer story: from challenge to result",
    "Quick myth versus fact breakdown",
    "A simple checklist for better outcomes",
    "Meet the people behind the brand",
    "Frequently asked questions answered",
    "This or that: let the audience decide",
    "Monthly highlights and key learnings",
    "Campaign recap and next-step invitation",
  ];
  const additionalDays = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  const assetTypes = ["Behind-the-Scenes Reel", "Tips Carousel", "Customer Story", "Myth vs Fact Post", "Checklist Carousel", "Team Spotlight", "FAQ Reel", "Interactive Poll", "Monthly Recap", "Campaign Finale"];
  const icons: IconName[] = ["movie", "carousel", "post", "post", "carousel", "post", "movie", "poll", "carousel", "movie"];
  const statuses: AssetRow["status"][] = ["BLUEPRINT", "READY", "BLUEPRINT", "GENERATING", "BLUEPRINT", "READY", "BLUEPRINT", "BLUEPRINT", "GENERATING", "BLUEPRINT"];

  const additionalRows = additionalDays.map((day, index): AssetRow => ({
    day: `Day ${day}`,
    date: formatScheduleDate(addDays(startDate, day - 1)),
    type: `${campaign.targetPlatforms[index % campaign.targetPlatforms.length] ?? firstPlatform} ${assetTypes[index]}`,
    topic: additionalTopics[index],
    status: statuses[index],
    action: statuses[index] === "READY" ? "Preview" : statuses[index] === "GENERATING" ? "Track" : "View Details",
    icon: icons[index],
  }));

  return [...initialRows, ...additionalRows];
}

function topicsForObjective(objective: string) {
  if (objective.includes("Sales")) {
    return [
      "Why customers should choose this offer now",
      "Limited-time value breakdown",
      "Objection handling before purchase",
      "Which benefit matters most?",
      "How the offer converts first-time buyers",
    ];
  }

  if (objective.includes("Lead")) {
    return [
      "The problem your audience wants solved",
      "A day in the life before the solution",
      "What makes a qualified prospect ready",
      "Which challenge blocks your growth?",
      "How the brand turns interest into action",
    ];
  }

  if (objective.includes("Education")) {
    return [
      "5 mistakes your audience should avoid",
      "A simple framework for smarter decisions",
      "Why speed and consistency matter",
      "What should we explain next?",
      "How education builds long-term trust",
    ];
  }

  return [
    "5 Mistakes in Digital Marketing",
    "A Day in the Life with AI OS",
    "Why Speed Matters in 2024",
    "Human vs AI: Who writes better?",
    "How TechCorp grew 300%",
  ];
}

function platformIcon(platform: string): IconName {
  if (platform === "TikTok" || platform === "YouTube") {
    return "movie";
  }

  if (platform === "LinkedIn") {
    return "layers";
  }

  if (platform === "Instagram") {
    return "post";
  }

  return "campaign";
}

function getDurationDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return 30;
  }

  return Math.floor(diff / 86_400_000) + 1;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatScheduleDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(value);
}

function CampaignSidebar() {
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

function SpecBlock({
  children,
  label,
}: Readonly<{
  children: React.ReactNode;
  label: string;
}>) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#717786]">
        {label}
      </p>
      {children}
    </div>
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
    carousel: <path d="M5 7h12v10H5zM2 9v6M20 9v6" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronRight: <path d="m9 6 6 6-6 6" />,
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    edit: <path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4" />,
    layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4" />,
    lightbulb: <path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2Z" />,
    movie: <path d="M4 5h16v14H4zM8 5l2 4M14 5l2 4M4 9h16" />,
    poll: <path d="M5 19V9M12 19V5M19 19v-7" />,
    post: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />,
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
