import type { ContentPillar } from "@/lib/calendar/types";

export function CalendarLegend({ pillars }: { pillars: ContentPillar[] }) {
  return <section aria-label="Content pillar legend" className="mb-5 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-extrabold uppercase tracking-[.12em] text-[#717786]">Content pillars</span>{pillars.map((pillar) => <span key={pillar.id} title={pillar.description} className="inline-flex items-center gap-2 rounded-full border border-[#c1c6d7] bg-white px-3 py-1.5 text-xs font-semibold"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: pillar.color }} />{pillar.name}</span>)}</section>;
}
