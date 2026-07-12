export type CalendarDateCell = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseLocalDate(dateString: string): Date {
  const match = dateOnlyPattern.exec(dateString);
  if (!match) throw new RangeError(`Invalid date-only value: ${dateString}`);

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new RangeError(`Invalid calendar date: ${dateString}`);
  }

  return date;
}

export function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getStartOfMonth(dateString: string): string {
  const date = parseLocalDate(dateString);
  return formatLocalDate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function getEndOfMonth(dateString: string): string {
  const date = parseLocalDate(dateString);
  return formatLocalDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function addMonths(dateString: string, amount: number): string {
  const date = parseLocalDate(dateString);
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  return formatLocalDate(
    new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(date.getDate(), lastDay)),
  );
}

export function addDays(dateString: string, amount: number): string {
  const date = parseLocalDate(dateString);
  return formatLocalDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount));
}

export function startOfWeek(dateString: string): string {
  const date = parseLocalDate(dateString);
  return addDays(dateString, -date.getDay());
}

export function isSameMonth(firstDate: string, secondDate: string): boolean {
  const first = parseLocalDate(firstDate);
  const second = parseLocalDate(secondDate);
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

export function isSameDate(firstDate: string, secondDate: string): boolean {
  return firstDate === secondDate;
}

export function getMonthGrid(dateString: string): CalendarDateCell[] {
  const monthStart = getStartOfMonth(dateString);
  const gridStart = startOfWeek(monthStart);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      dayNumber: parseLocalDate(date).getDate(),
      isCurrentMonth: isSameMonth(date, dateString),
    };
  });
}

export function getWeekDates(dateString: string): string[] {
  const weekStart = startOfWeek(dateString);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function formatMonthTitle(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    parseLocalDate(dateString),
  );
}

export function formatWeekRange(dateString: string): string {
  const dates = getWeekDates(dateString);
  const start = parseLocalDate(dates[0]);
  const end = parseLocalDate(dates[6]);
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}
