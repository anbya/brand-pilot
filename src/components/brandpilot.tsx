import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Shell({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
              {description}
            </p>
          ) : null}
        </section>
        {children}
      </div>
    </main>
  );
}

export function TopNav() {
  const items = [
    ["/dashboard", "Dashboard"],
    ["/brands", "Brands"],
    ["/campaigns", "Campaigns"],
    ["/calendar", "Calendar"],
    ["/assets", "Assets"],
    ["/approval", "Approval"],
    ["/downloads", "Downloads"],
  ] as const;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
            BP
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              BrandPilot AI
            </p>
            <p className="text-sm text-slate-500">Phase 1 MVP Workspace</p>
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-2 lg:flex">
          {items.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 sm:block">
          AI queue live
        </div>
      </div>
    </header>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    review: "border-amber-200 bg-amber-50 text-amber-700",
    generating: "border-blue-200 bg-blue-50 text-blue-700",
    draft: "border-slate-200 bg-slate-100 text-slate-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    need_revision: "border-orange-200 bg-orange-50 text-orange-700",
    queued: "border-slate-200 bg-slate-100 text-slate-700",
    running: "border-blue-200 bg-blue-50 text-blue-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        tones[status] ?? "border-slate-200 bg-slate-100 text-slate-700",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function StatGrid({
  stats,
}: {
  stats: Array<{ label: string; value: string; hint: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-900">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
        </Card>
      ))}
    </div>
  );
}

export function ActionRow() {
  const actions = [
    ["/brands", "Buat brand profile"],
    ["/campaigns", "Generate campaign"],
    ["/approval", "Masuk ke approval desk"],
    ["/downloads", "Unduh paket campaign"],
  ] as const;

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="min-h-12 align-top transition hover:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MiniProgress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
    </div>
  );
}
