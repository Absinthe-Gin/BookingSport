import { useEffect, useRef } from 'react';
import type { Availability, SelectedSlot, SlotState } from '@shared/types';
import { slotToTime } from '@shared/schedule';

const COURT_COL = 60;
const ROW_H = 40;
const HEAD_H = 35;

const cellColor: Record<SlotState, string> = {
  free: 'bg-slot-free hover:bg-primary-soft cursor-pointer',
  booked: 'bg-slot-booked',
  past: 'bg-slot-past',
  locked: 'bg-slot-locked',
  event: 'bg-slot-event',
};

interface Props {
  availability: Availability;
  selected: SelectedSlot[];
  onToggle: (slot: SelectedSlot) => void;
  onEvent: () => void;
  cellWidth: number;
}

/** Courts × 30-minute slots. Free cells toggle selection; event blocks open social booking. */
export function BookingGrid({ availability, selected, onToggle, onEvent, cellWidth }: Props) {
  const { cells, courts, startHour, events } = availability;
  const slots = cells[0]?.length ?? 0;
  const scroller = useRef<HTMLDivElement>(null);
  const selectedSet = new Set(selected.map((s) => `${s.court}:${s.slot}`));

  useEffect(() => {
    const firstOpen = cells[0]?.findIndex((c) => c !== 'past') ?? 0;
    if (scroller.current && firstOpen > 0) scroller.current.scrollLeft = Math.max(0, (firstOpen - 1) * cellWidth);
    // Only on date change, not on every zoom step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability.date, availability.venueSlug]);

  return (
    <div ref={scroller} className="overflow-x-auto" role="grid" aria-label="Bảng trạng thái sân" aria-rowcount={courts.length + 1}>
      <div style={{ width: COURT_COL + slots * cellWidth + 40 }}>
        <div className="relative flex bg-grid-head" style={{ height: HEAD_H }} role="row">
          <div className="sticky left-0 z-10 bg-grid-head" style={{ width: COURT_COL }} />
          {Array.from({ length: slots + 1 }, (_, k) => (
            <span key={k} className="absolute top-2 -translate-x-1/2 text-xs text-ink" style={{ left: COURT_COL + k * cellWidth }}>
              {slotToTime(startHour, k).replace(/^0/, '')}
              <span className="absolute top-[19px] left-1/2 h-1.5 w-[2px] -translate-x-1/2 bg-accent" />
            </span>
          ))}
        </div>
        {courts.map((court, ci) => (
          <div key={court} className="relative flex" style={{ height: ROW_H }} role="row">
            <div role="rowheader" className="sticky left-0 z-10 flex items-center justify-center border border-[#9ccab0] bg-grid-court text-sm text-ink" style={{ width: COURT_COL }}>
              {court}
            </div>
            {cells[ci].map((state, si) => {
              const isSel = selectedSet.has(`${ci}:${si}`);
              const label = `${court} ${slotToTime(startHour, si)} - ${slotToTime(startHour, si + 1)}`;
              return (
                <button key={si} type="button" role="gridcell" disabled={state !== 'free'} aria-pressed={isSel}
                  aria-label={`${label}: ${isSel ? 'đã chọn' : state === 'free' ? 'trống' : 'không khả dụng'}`}
                  onClick={() => onToggle({ court: ci, slot: si })}
                  className={`shrink-0 border-[0.5px] border-[#8f8f8f] disabled:cursor-default ${isSel ? 'bg-slot-selected outline-2 -outline-offset-2 outline-ink' : cellColor[state]}`}
                  style={{ width: cellWidth }} />
              );
            })}
            {events.filter((e) => e.court === ci).map((e) => (
              <button key={e.startSlot} type="button" onClick={onEvent}
                className="absolute top-0 flex h-full flex-col items-center justify-center overflow-hidden border border-[#8f8f8f] bg-slot-event px-1 text-center text-[10px] leading-tight text-white/90"
                style={{ left: COURT_COL + e.startSlot * cellWidth, width: (e.endSlot - e.startSlot) * cellWidth }}>
                <span className="absolute top-0.5 right-0.5 rounded bg-[#1f4fa8] px-1 text-[8px] font-bold text-white">{e.level}</span>
                <span className="w-full truncate">{e.label}</span>
                <span className="text-[11px]">{e.taken}/{e.capacity}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
