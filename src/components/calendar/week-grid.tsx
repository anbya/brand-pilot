import { CalendarEventCard } from "@/components/calendar/calendar-event-card";
import { getWeekDates, parseLocalDate } from "@/lib/calendar/date-utils";
import type { CalendarEventViewModel } from "@/lib/calendar/selectors";

type WeekGridProps = { currentDate: string; events: CalendarEventViewModel[]; today: string; onEventClick: (versionId: string) => void };
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const sortEvents = (events: CalendarEventViewModel[]) => [...events].sort((first, second) => first.publishTime.localeCompare(second.publishTime) || first.title.localeCompare(second.title));

export function WeekGrid({ currentDate, events, today, onEventClick }: WeekGridProps) {
  return <div className="overflow-x-auto rounded-xl border border-[#c1c6d7] bg-white shadow-sm" data-testid="week-scroll-wrapper"><div className="grid min-w-[980px] grid-cols-7" data-testid="week-grid">{getWeekDates(currentDate).map((date) => { const isToday = date === today; const dayEvents = sortEvents(events.filter((event) => event.publishDate === date)); return <section key={date} aria-label={`Agenda for ${date}`} className="min-h-[430px] border-r border-[#e2e8f0] last:border-r-0"><header className={`border-b border-[#e2e8f0] px-3 py-4 text-center ${isToday ? "bg-[#e5eeff]" : "bg-[#eff4ff]/60"}`}><p className="text-xs font-extrabold uppercase tracking-[.1em] text-[#657080]">{dayFormatter.format(parseLocalDate(date))}</p><p aria-current={isToday ? "date" : undefined} className={`mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${isToday ? "bg-[#0058bc] text-white" : "text-[#0b1c30]"}`}>{parseLocalDate(date).getDate()}<span className="sr-only">{isToday ? " Today" : ""}</span></p></header><div className="grid gap-2 p-2">{dayEvents.length ? dayEvents.map((event) => <CalendarEventCard key={event.id} event={event} onClick={onEventClick} />) : <p className="py-8 text-center text-xs font-semibold text-[#a1a9b5]">No posts</p>}</div></section>; })}</div></div>;
}
