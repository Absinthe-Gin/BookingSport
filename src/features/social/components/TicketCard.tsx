import { Icon } from '@/components/common/Icon';
import { formatVnd } from '@shared/schedule';
import type { SocialSession } from '@shared/types';

interface Props {
  session: SocialSession & { live?: boolean };
  onJoin: () => void;
  onOpen?: () => void;
}

/** Social ticket: time stub on the left, title/level/court/spots/price on the right. */
export function TicketCard({ session, onJoin, onOpen }: Props) {
  const full = session.taken >= session.capacity;
  const pct = Math.min(100, Math.round((session.taken / session.capacity) * 100));
  return (
    <article className="flex w-[440px] max-w-[85vw] shrink-0 overflow-hidden rounded-lg border border-[#f3b8c4] bg-white">
      <div className="flex w-[66px] shrink-0 flex-col items-center justify-center gap-1 border-r border-dashed border-[#f3b8c4] bg-[#fde7ec] text-[#e5484d]">
        {session.live && (
          <span className="mb-1 flex items-center gap-1 rounded bg-[#e5484d] px-1.5 py-0.5 text-[10px] font-bold text-white"><span className="h-1.5 w-1.5 rounded-full bg-white" />LIVE</span>
        )}
        <span className="text-lg font-bold">{session.startTime}</span>
        <span className="h-3 w-px bg-current opacity-40" />
        <span className="text-sm">{session.endTime}</span>
      </div>
      <div className="min-w-0 flex-1 p-3">
        <button type="button" onClick={onOpen} className="flex w-full items-center justify-between text-left">
          <span className="truncate text-[15px] font-bold text-ink">{session.title}</span>
          <Icon name="chevron-right" size={18} className="shrink-0 text-muted" />
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="flex items-center gap-1 rounded-md border border-[#c21fb8] px-1.5 text-[#c21fb8]"><Icon name="ticket" size={14} />Xé vé</span>
          <span className="flex items-center gap-1 rounded-md bg-[#1f4fa8] px-1.5 text-white">{session.level}</span>
          <span className="flex items-center gap-1 text-ink"><Icon name="map-fold" size={14} className="text-primary" />{session.court}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[13px] text-muted"><Icon name="users" size={15} />{session.taken}/{session.capacity} chỗ</span>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-[#e6e6e6]"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
          </div>
          <span className="text-[17px] font-bold text-[#f08c00]">{formatVnd(session.price)} <span className="text-xs font-normal text-muted">/ vé</span></span>
        </div>
        <div className="mt-2 flex justify-end">
          <button type="button" onClick={onJoin} disabled={full}
            className="flex h-8 items-center gap-1 rounded-md border border-primary px-3 text-sm font-semibold text-primary hover:bg-primary-soft disabled:border-line disabled:text-muted">
            <Icon name="plus" size={16} strokeWidth={2.4} />{full ? 'Hết chỗ' : 'Đặt chỗ'}
          </button>
        </div>
      </div>
    </article>
  );
}
