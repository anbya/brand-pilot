import { CalendarDayCell } from "@/components/calendar/calendar-day-cell";
import { getMonthGrid } from "@/lib/calendar/date-utils";
import type { CalendarEventViewModel } from "@/lib/calendar/selectors";

type MonthGridProps = { currentDate: string; events: CalendarEventViewModel[]; today: string; onEventClick: (versionId: string) => void; onMoreClick: (date: string) => void };
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const sortEvents = (events: CalendarEventViewModel[]) => [...events].sort((first, second) => first.publishTime.localeCompare(second.publishTime) || first.title.localeCompare(second.title));

export function MonthGrid({ currentDate, events, today, onEventClick, onMoreClick }: MonthGridProps) {
  return <div className="overflow-x-auto rounded-xl border border-[#c1c6d7] bg-white shadow-sm" data-testid="month-scroll-wrapper"><div className="min-w-[900px]"><div className="grid grid-cols-7 border-b border-[#c1c6d7] bg-[#eff4ff]/70">{weekdays.map((day) => <div key={day} className="py-3 text-center text-xs font-extrabold uppercase tracking-[.1em] text-[#414755]">{day}</div>)}</div><div className="grid grid-cols-7" data-testid="month-grid">{getMonthGrid(currentDate).map((cell) => <CalendarDayCell key={cell.date} {...cell} isToday={cell.date === today} events={sortEvents(events.filter((event) => event.publishDate === cell.date))} maxVisibleEvents={3} onEventClick={onEventClick} onMoreClick={onMoreClick} />)}</div></div></div>;
}
