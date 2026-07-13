import type { CalendarEventViewModel } from "@/lib/calendar/selectors";

const statusStyles = { draft: "bg-slate-100 text-slate-700", ready: "bg-emerald-100 text-emerald-800", scheduled: "bg-blue-100 text-blue-800", published: "bg-violet-100 text-violet-800", failed: "bg-rose-100 text-rose-800" } as const;
const titleCase = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());

type CalendarEventCardProps = { event: CalendarEventViewModel; compact?: boolean; highlighted?: boolean; onClick: (versionId: string) => void };

export function CalendarEventCard({ event, compact = false, highlighted = false, onClick }: CalendarEventCardProps) {
  const generated = event.isGenerated;
  return <button type="button" aria-label={`${highlighted ? "Newly added, " : ""}${event.title}, ${generated ? "Generated, " : ""}${titleCase(event.platform)}, ${event.publishDate} at ${event.publishTime}, ${titleCase(event.status)}`} onClick={() => onClick(event.id)} className={`w-full min-w-0 rounded-lg border-l-4 text-left text-[#0b1c30] outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#0058bc] ${highlighted ? "ring-2 ring-[#0058bc] ring-offset-1" : ""} ${compact ? "p-1.5" : "p-3"}`} style={{ borderLeftColor: event.pillarColor, backgroundColor: `${event.pillarColor}14` }}>
    <span className={`block font-extrabold ${compact ? "line-clamp-2 text-[11px]" : "break-words text-sm"}`}>{compact ? `${event.publishTime} ${event.title}` : event.title}</span>
    {!compact && <span className="mt-1 block text-xs font-bold text-[#414755]">{event.publishTime}</span>}
    <span className={`block truncate font-semibold text-[#657080] ${compact ? "mt-0.5 text-[9px]" : "mt-2 text-xs"}`}>{titleCase(event.platform)} · {titleCase(event.assetType)}</span>
    <span className="mt-1.5 flex flex-wrap gap-1"><span className={`inline-flex rounded-full px-2 py-0.5 font-extrabold ${compact ? "text-[8px]" : "text-[10px]"} ${statusStyles[event.status]}`}>{titleCase(event.status)}</span>{generated && <span className={`inline-flex rounded-full bg-violet-50 px-2 py-0.5 font-extrabold text-violet-700 ${compact ? "text-[8px]" : "text-[10px]"}`}>Generated</span>}{highlighted && <span className={`inline-flex rounded-full bg-[#0058bc] px-2 py-0.5 font-extrabold text-white ${compact ? "text-[8px]" : "text-[10px]"}`}>New</span>}</span>
  </button>;
}
