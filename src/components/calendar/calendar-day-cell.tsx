import { CalendarEventCard } from "@/components/calendar/calendar-event-card";
import type { CalendarEventViewModel } from "@/lib/calendar/selectors";

type CalendarDayCellProps = { date: string; dayNumber: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEventViewModel[]; highlightedVersionIds: ReadonlySet<string>; maxVisibleEvents: number; onEventClick: (versionId: string) => void; onMoreClick: (date: string) => void };

export function CalendarDayCell({ date, dayNumber, isCurrentMonth, isToday, events, highlightedVersionIds, maxVisibleEvents, onEventClick, onMoreClick }: CalendarDayCellProps) {
  const hiddenCount = Math.max(events.length - maxVisibleEvents, 0);
  return <article aria-label={date} className={`min-h-[190px] border-b border-r border-[#e2e8f0] p-2 ${isCurrentMonth ? "bg-white" : "bg-[#eff4ff]/50 text-[#717786]"}`}>
    <div className="mb-2 flex h-7 items-center"><button type="button" aria-label={`Open agenda for ${date}`} aria-current={isToday ? "date" : undefined} onClick={() => onMoreClick(date)} className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-xs font-extrabold outline-none hover:bg-[#e5eeff] focus-visible:ring-2 focus-visible:ring-[#0058bc] ${isToday ? "bg-[#0058bc] text-white hover:bg-[#004493]" : ""}`}>{dayNumber}<span className="sr-only">{isToday ? " Today" : ""}</span></button></div>
    <div className="grid gap-1.5">{events.slice(0, maxVisibleEvents).map((event) => <CalendarEventCard key={event.id} event={event} compact highlighted={highlightedVersionIds.has(event.id)} onClick={onEventClick} />)}{hiddenCount > 0 && <button type="button" aria-label={`Show ${hiddenCount} more events for ${date}`} onClick={() => onMoreClick(date)} className="rounded px-1 py-1 text-left text-[10px] font-extrabold text-[#0058bc] outline-none hover:bg-[#eff4ff] hover:underline focus-visible:ring-2 focus-visible:ring-[#0058bc]">+{hiddenCount} more</button>}</div>
  </article>;
}
