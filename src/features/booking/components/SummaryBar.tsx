import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import { formatMinutes, formatVnd } from '@shared/schedule';
import type { BookingLine } from '@shared/types';

interface Props {
  lines: BookingLine[];
  totalMinutes: number;
  totalPrice: number;
  quoting: boolean;
  onNext: () => void;
}

/** Bottom bar: totals for the selection, expandable list of chosen ranges, and the Next button. */
export function SummaryBar({ lines, totalMinutes, totalPrice, quoting, onNext }: Props) {
  const [open, setOpen] = useState(false);
  const has = lines.length > 0;
  return (
    <div className={`fixed right-0 bottom-0 left-0 z-(--z-nav) ${has ? 'rounded-t-[14px] bg-primary' : ''}`}>
      {has && (
        <>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Thu gọn' : 'Xem chi tiết'}
            className="flex w-full justify-center pt-2 text-white">
            <Icon name={open ? 'chevron-down' : 'chevron-up'} size={20} strokeWidth={2.6} />
          </button>
          {open && (
            <ul className="max-h-48 overflow-y-auto px-2.5 pt-1 text-sm text-white">
              {lines.map((l) => (
                <li key={`${l.court}-${l.startSlot}`} className="flex justify-between border-b border-white/15 py-1.5">
                  <span>{l.courtName}: {l.startTime} - {l.endTime}</span>
                  <span className="font-semibold text-accent">{formatVnd(l.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between px-2.5 pt-2 pb-1.5 text-[17px] font-bold text-white">
            <span>Tổng giờ: {formatMinutes(totalMinutes)}</span>
            <span>Tổng tiền: {formatVnd(totalPrice)}</span>
          </div>
        </>
      )}
      <div className="px-2.5 pb-2.5">
        <Button variant="accent" onClick={onNext} loading={quoting} className="h-[50px] w-full rounded-md text-base">TIẾP THEO</Button>
      </div>
    </div>
  );
}
