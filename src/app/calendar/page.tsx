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
  | "chevronLeft"
  | "chevronRight"
  | "dashboard"
  | "movie"
  | "promo"
  | "school"
  | "settings"
  | "spark"
  | "story";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5LtcSEZ7F5QffQjEpFdB4p3jqD2GVDvGjOPezI4zUOYKPK6IqzRZwAMUi9xvpAiVsZ81RRy_bbmzqkzqLaGPEZoGs-LQTRXzJlojqaC6BLHrNa-iu_stwKurd_kr30Pu52GcQJ48h7mj5pEF91bwZFXHnaEZS4JFXdalOTDUX9H_X-AzbxIMa9VQG87tdkaA4g32dcXsT3FBGWsgzbIC_mqPyFjj410cbXW19irJXn_0-Q9h_HKro";

const teamImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAmIHHW9OsNVtDymmwxZgfn9wZZBGLyOLQwdiEey0TzxOpw86mgovDdfKHlsv9qC6m8FLVk_6bdpvrjh-aDq4ANOoTOv0lNSu6fRTxCQzmlYJLKCnM7Uy4xX6eQxVWzpDmHIyNjqABIvM9gM0trfHLUcv_OTumL1LIhL3ZcVbkmh5e8QO58GXX0HjlzRMGs4-_RFJl2Vcv31o107FDTkI3RwxIEOFfBEcyJVNvmBHD7MLfAqSNx188",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAseD8mkp2tp-psAxPjBx6XB7r1qEZXuqPZCIWPwqBKYXRmiSM1bN2fxn5cr9nleDuk3VmLIknDB94hGgL-vHn1FgLKT9UAcnaY6SUd643CodVHD5_rXqrAxjtCpDN5zdNWfHTd8YGWYxXkxzFIfETf1GDEarMANgOxU4e9gJg4mFBqRDeeRHxHxcVdIyzHUUZcvowgm_O2H9TbSnmbb3xK6Lb6Geqlh-VwLnOANr3DLp3qI4D3t299",
] as const;

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Brands", icon: "brands", href: "/brands" },
  { label: "Campaigns", icon: "campaign", href: "/campaigns" },
  { label: "Content Calendar", icon: "calendar", href: "/calendar", active: true },
  { label: "Assets", icon: "assets", href: "/assets" },
  { label: "Analytics", icon: "analytics", href: "/analytics" },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

const calendarCells = [
  { day: "30", muted: true },
  { day: "1" },
  { day: "2" },
  { day: "3" },
  {
    day: "4",
    events: [{ label: "Kopi 101 Education", type: "education", icon: "school" }],
  },
  { day: "5" },
  { day: "6" },
  { day: "7" },
  {
    day: "8",
    events: [{ label: "Monday Brew Reel", type: "reel", icon: "movie" }],
  },
  { day: "9" },
  {
    day: "10",
    today: true,
    events: [
      { label: "Quick Tips Story", type: "story", icon: "story" },
      { label: "Latte Art Guide", type: "education", icon: "school" },
    ],
  },
  { day: "11" },
  { day: "12" },
  { day: "13" },
  { day: "14" },
  { day: "15" },
  {
    day: "16",
    events: [{ label: "Mid-Month Promo", type: "promo", icon: "promo" }],
  },
  { day: "17" },
  { day: "18" },
  { day: "19" },
  { day: "20" },
  { day: "21" },
  { day: "22" },
  { day: "23" },
  { day: "24" },
  {
    day: "25",
    events: [{ label: "Weekend Vibe Reel", type: "reel", icon: "movie" }],
  },
  { day: "26" },
  { day: "27" },
  { day: "28" },
  { day: "29" },
  { day: "30" },
  { day: "31" },
  { day: "1", muted: true },
  { day: "2", muted: true },
  { day: "3", muted: true },
] satisfies Array<{
  day: string;
  muted?: boolean;
  today?: boolean;
  events?: Array<{ label: string; type: "education" | "reel" | "story" | "promo"; icon: IconName }>;
}>;

const eventStyles = {
  education: "border-[#4648d4] bg-[#e1e0ff] text-[#2f2ebe]",
  reel: "border-[#006947] bg-[#6ffbbe] text-[#005236]",
  story: "border-[#0058bc] bg-[#d8e2ff] text-[#004493]",
  promo: "border-[#ba1a1a] bg-[#ffdad6] text-[#93000a]",
} satisfies Record<"education" | "reel" | "story" | "promo", string>;

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
      <CalendarSidebar />

      <section className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-[#d3e4fe]/70 bg-[#f8f9ff]/85 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="text-xl font-extrabold text-[#0b1c30]">Content Calendar</h1>
              <div className="flex w-fit rounded-lg bg-[#e5eeff] p-1">
                <button
                  className="rounded-md bg-white px-4 py-1.5 text-sm font-bold text-[#0058bc] shadow-sm"
                  type="button"
                >
                  Month
                </button>
                <button
                  className="rounded-md px-4 py-1.5 text-sm font-bold text-[#414755] transition hover:text-[#0058bc]"
                  type="button"
                >
                  Week
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {teamImages.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    width={32}
                    height={32}
                    alt={`Team member ${index + 1}`}
                    className="h-8 w-8 rounded-full border-2 border-[#f8f9ff] object-cover"
                  />
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8f9ff] bg-[#0070eb] text-[10px] font-extrabold text-white">
                  +3
                </span>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-[#0058bc] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#004493]"
                type="button"
              >
                <Icon name="add" className="h-4 w-4" />
                Schedule Post
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-2xl font-extrabold text-[#0b1c30]">July 2024</h2>
              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#414755] transition hover:bg-[#e5eeff]"
                  type="button"
                >
                  <Icon name="chevronLeft" className="h-5 w-5" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#414755] transition hover:bg-[#e5eeff]"
                  type="button"
                >
                  <Icon name="chevronRight" className="h-5 w-5" />
                </button>
              </div>
              <button className="text-sm font-bold text-[#0058bc] transition hover:text-[#004493]" type="button">
                Today
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Legend color="bg-[#4648d4]" label="Education" />
              <Legend color="bg-[#006947]" label="Reel" />
              <Legend color="bg-[#0058bc]" label="Story" />
              <Legend color="bg-[#93000a]" label="Promo" />
            </div>
          </div>

          <section className="overflow-hidden rounded-lg border border-[#c1c6d7] bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b border-[#c1c6d7] bg-[#eff4ff]/70">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center text-sm font-extrabold text-[#414755]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7">
              {calendarCells.map((cell, index) => (
                <article
                  key={`${cell.day}-${index}`}
                  className={`min-h-[128px] border-b border-r border-[#e2e8f0] p-3 transition hover:bg-[#f1f5f9] sm:min-h-[158px] ${
                    index % 7 === 6 ? "sm:border-r-0" : ""
                  } ${cell.muted ? "bg-[#eff4ff]/40 text-[#717786] opacity-55" : "bg-white text-[#0b1c30]"}`}
                >
                  {cell.today ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0058bc] text-sm font-extrabold text-white">
                      {cell.day}
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold">{cell.day}</span>
                  )}

                  {cell.events ? (
                    <div className="mt-2 grid gap-2">
                      {cell.events.map((event) => (
                        <button
                          key={event.label}
                          className={`flex min-h-9 items-center gap-2 rounded-lg border-l-4 p-2 text-left text-[11px] font-extrabold leading-tight transition hover:brightness-95 ${eventStyles[event.type]}`}
                          type="button"
                        >
                          <Icon name={event.icon} className="h-4 w-4 shrink-0" />
                          <span>{event.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
          <button
            className="inline-flex items-center gap-3 rounded-full bg-[#4648d4] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#393bb8]"
            type="button"
          >
            <Icon name="spark" className="h-5 w-5" />
            AI Auto-Plan Week
          </button>
        </div>
      </section>
    </main>
  );
}

function CalendarSidebar() {
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

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#c1c6d7] bg-white px-3 py-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
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
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 6 6 6-6 6" />,
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    movie: <path d="M4 5h16v14H4zM8 5l2 4M14 5l2 4M4 9h16" />,
    promo: <path d="m20 12-8 8-8-8 8-8 8 8ZM12 8v4l3 2" />,
    school: <path d="m3 9 9-5 9 5-9 5-9-5Zm4 3v4c2.6 2 7.4 2 10 0v-4" />,
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />,
    story: <path d="M12 8v5l3 2M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0 1 12-3M19 15a7 7 0 0 1-12 3" />,
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
