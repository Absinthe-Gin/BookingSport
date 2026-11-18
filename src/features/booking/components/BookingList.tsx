import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import { ErrorState, LoadingBlock } from '@/components/feedback/States';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useDialog } from '@/app/providers/DialogProvider';
import { api } from '@/services/api';
import { formatMinutes, formatVnd } from '@shared/schedule';
import { ddmmyyyy, todayLocal } from '@/utils/date';
import type { Booking } from '@shared/types';
import { BookingStatusBadge } from './BookingStatusBadge';

function BookingCard({ booking, onCancel, busy }: { booking: Booking; onCancel: () => void; busy: boolean }) {
  return (
    <article className="rounded-lg border border-line bg-white p-3 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-ink">{booking.venueName}</h3>
          <p className="truncate text-xs text-muted">{booking.venueAddress}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>
      <div className="mt-2 space-y-1 text-sm text-ink">
        <p className="flex items-center gap-1.5"><Icon name="calendar" size={16} className="text-primary" />{ddmmyyyy(booking.date)} · Mã {booking.code}</p>
        {booking.lines.map((l) => (
          <p key={`${l.court}-${l.startSlot}`} className="pl-6">{l.courtName}: {l.startTime} - {l.endTime}</p>
        ))}
        <p className="pl-6 text-muted">Tổng giờ {formatMinutes(booking.totalMinutes)} · <b className="text-primary">{formatVnd(booking.totalPrice)}</b></p>
      </div>
      {booking.status !== 'cancelled' && (
        <div className="mt-3 flex justify-end gap-2">
          {booking.status === 'pending_payment' && (
            <Link to={`/booking/${booking.code}`} className="flex h-9 items-center rounded bg-accent px-4 text-sm font-bold text-white">Thanh toán</Link>
          )}
          <Button variant="outline" className="h-9 px-4 text-sm" loading={busy} onClick={onCancel}>Huỷ lịch</Button>
        </div>
      )}
    </article>
  );
}

/** "Danh sách đặt lịch": upcoming bookings by default, all with "Xem tất cả". */
export function BookingList() {
  const { user } = useAuth();
  const toast = useToast();
  const dialog = useDialog();
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const list = useAsync(() => (user ? api.myBookings() : Promise.resolve([])), [user?.id]);

  const cancel = async (code: string) => {
    if (!(await dialog.confirm('Bạn chắc chắn muốn huỷ lịch đặt này?'))) return;
    setBusy(code);
    try {
      const b = await api.cancelBooking(code);
      list.setData((prev) => prev?.map((x) => (x.code === code ? b : x)));
      toast.show('Đã huỷ lịch đặt');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    } finally {
      setBusy(null);
    }
  };

  const today = todayLocal();
  const items = (list.data ?? []).filter((b) => showAll || (b.date >= today && b.status !== 'cancelled'));

  return (
    <div>
      <div className="flex justify-end p-2.5">
        <button type="button" onClick={() => setShowAll((s) => !s)} aria-pressed={showAll}
          className={`flex h-[42px] w-[200px] items-center justify-between rounded-md border px-4 text-[15px] ${showAll ? 'border-primary bg-primary-soft text-primary' : 'border-ink/60 text-ink'}`}>
          <span className="flex-1 text-center">{showAll ? 'Sắp tới' : 'Xem tất cả'}</span>
          <Icon name="calendar" size={18} className="text-primary-deep" />
        </button>
      </div>
      {list.loading ? <LoadingBlock /> : list.error ? <ErrorState message={list.error.message} onRetry={list.reload} />
        : items.length === 0 ? <p className="py-40 text-center text-[15px] text-ink">Bạn chưa có lịch đặt</p>
        : (
          <div className="grid gap-3 px-2.5 pb-6 xl:grid-cols-2">
            {items.map((b) => <BookingCard key={b.code} booking={b} busy={busy === b.code} onCancel={() => cancel(b.code)} />)}
          </div>
        )}
    </div>
  );
}

