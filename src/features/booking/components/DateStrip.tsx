import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { dateRange, dayOfMonth, ddmm, isWeekend, monthLabel, weekdayShort } from '@/utils/date';

interface Props {
  today: string;
  value: string;
  onChange: (date: string) => void;
  /** How many months the month menu offers, counting the current one. */
  months?: number;
}

function monthStart(date: string) {
  return `${date.slice(0, 7)}-01`;
}

function daysInMonth(date: string) {
  const [y, m] = date.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

/** Month menu plus a row of day chips, from today to the end of the chosen month. */
export function DateStrip({ today, value, onChange, months = 2 }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);
  const month = monthStart(value);
  const first = month <= today ? today : month;
  const days = dateRange(first, daysInMonth(month) - Number(dayOfMonth(first)) + 1);
  const monthOptions = Array.from({ length: months }, (_, i) => {
    const d = new Date(`${monthStart(today)}T00:00:00`);
    d.setMonth(d.getMonth() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });

  useEffect(() => { activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [value]);

  return (
    <div className="rounded-[10px] bg-primary-dark px-2 pt-2 pb-2">
      <div className="relative">
        <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}
          className="flex items-center gap-2 px-1.5 py-1 text-sm font-bold text-white">
          {monthLabel(value)} <Icon name="chevron-down" size={14} strokeWidth={3} />
        </button>
        {menuOpen && (
          <ul className="absolute top-full left-0 z-20 mt-1 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-bar">
            {monthOptions.map((m) => (
              <li key={m}>
                <button type="button" onClick={() => { onChange(m <= today ? today : m); setMenuOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-primary-soft ${m === month ? 'font-bold text-primary' : 'text-ink'}`}>
                  {monthLabel(m)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="no-scrollbar mt-1 flex gap-1.5 overflow-x-auto pb-0.5" role="listbox" aria-label="Chọn ngày">
        {days.map((d) => {
          const active = d === value;
          const isToday = d === today;
          return (
            <button key={d} ref={active ? activeRef : undefined} type="button" role="option" aria-selected={active} onClick={() => onChange(d)}
              className={`flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-[10px] border leading-tight ${active ? 'border-white bg-white text-primary' : 'border-white/35 text-white hover:bg-white/10'}`}>
              <span className={`text-[11px] ${!active && isWeekend(d) ? 'text-accent' : ''}`}>{isToday ? 'Hôm nay' : weekdayShort(d)}</span>
              <span className="text-[13px] font-bold">{ddmm(d)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

