const WEEKDAY_LONG = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function parse(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

export function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(date: string, n: number): string {
  const d = parse(date);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function longDate(date: string): string {
  const d = parse(date);
  return `${WEEKDAY_LONG[d.getDay()]}, ${ddmmyyyy(date)}`;
}

export function ddmmyyyy(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

export function ddmm(date: string): string {
  const [, m, d] = date.split('-');
  return `${d}/${m}`;
}

export function weekdayShort(date: string): string {
  return WEEKDAY_SHORT[parse(date).getDay()];
}

export function isWeekend(date: string): boolean {
  const day = parse(date).getDay();
  return day === 0 || day === 6;
}

export function monthLabel(date: string): string {
  const [y, m] = date.split('-');
  return `Tháng ${Number(m)}, ${y}`;
}

export function dayOfMonth(date: string): string {
  return date.split('-')[2];
}

export function dateRange(start: string, days: number): string[] {
  return Array.from({ length: days }, (_, i) => addDays(start, i));
}
