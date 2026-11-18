import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import { ErrorState, LoadingBlock } from '@/components/feedback/States';
import { bookingPhone } from '@/features/booking/draft';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/app/providers/ToastProvider';
import { api } from '@/services/api';
import { formatMinutes, formatVnd } from '@shared/schedule';
import { ddmmyyyy } from '@/utils/date';

/** Bank details shown for the simulated transfer. The clone has no payment gateway. */
const BANK = { name: 'Vietcombank', account: '0011 0045 6789', holder: 'CONG TY ALOBO (MO PHONG)' };

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  const toast = useToast();
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 text-[15px] last:border-0">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-2 text-right font-semibold text-ink">
        {value}
        {copy && (
          <button type="button" aria-label={`Sao chép ${label}`} className="text-primary"
            onClick={() => navigator.clipboard?.writeText(value.replace(/\s/g, '')).then(() => toast.show(`Đã sao chép ${label.toLowerCase()}`))}>
            <Icon name="copy" size={18} />
          </button>
        )}
      </span>
    </div>
  );
}

export default function BookingResultPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const phone = bookingPhone(code);
  const { data: booking, error, loading, reload, setData } = useAsync(() => api.booking(code, phone), [code]);
  const [busy, setBusy] = useState<'pay' | 'cancel' | null>(null);

  const act = async (kind: 'pay' | 'cancel') => {
    setBusy(kind);
    try {
      const b = kind === 'pay' ? await api.payBooking(code, phone) : await api.cancelBooking(code, phone);
      setData(() => b);
      toast.show(kind === 'pay' ? 'Thanh toán thành công' : 'Đã huỷ lịch đặt');
    } catch (e) {
      toast.show((e as Error).message, 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary-soft pb-10">
      <PageHeader title="Thanh toán" onBack={() => navigate('/')} />
      {loading && <LoadingBlock />}
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {booking && (
        <div className="mx-auto max-w-[640px] space-y-4 px-2.5 pt-4">
          <section className="rounded-xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Mã đặt lịch</p>
                <p className="text-xl font-bold tracking-wide text-primary">{booking.code}</p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div className="mt-3">
              <Row label="Sân" value={booking.venueName} />
              <Row label="Ngày" value={ddmmyyyy(booking.date)} />
              {booking.lines.map((l) => (
                <Row key={`${l.court}-${l.startSlot}`} label={l.courtName} value={`${l.startTime} - ${l.endTime} · ${formatVnd(l.price)}`} />
              ))}
              <Row label="Tổng giờ" value={formatMinutes(booking.totalMinutes)} />
              <Row label="Người đặt" value={`${booking.customerName} · ${booking.customerPhone}`} />
              <Row label="Tổng tiền" value={formatVnd(booking.totalPrice)} />
            </div>
          </section>

          {booking.status === 'pending_payment' && (
            <section className="rounded-xl bg-white p-4 shadow-card">
              <h2 className="text-[17px] font-bold text-primary">Chuyển khoản ngân hàng</h2>
              <p className="mt-1 text-sm text-muted">Bản demo không kết nối cổng thanh toán. Bấm "Tôi đã chuyển khoản" để mô phỏng thanh toán thành công.</p>
              <div className="mt-3">
                <Row label="Ngân hàng" value={BANK.name} />
                <Row label="Số tài khoản" value={BANK.account} copy />
                <Row label="Chủ tài khoản" value={BANK.holder} />
                <Row label="Số tiền" value={formatVnd(booking.totalPrice)} />
                <Row label="Nội dung" value={booking.code} copy />
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <Button variant="outline" className="h-11" loading={busy === 'cancel'} disabled={!!busy} onClick={() => act('cancel')}>Huỷ lịch</Button>
                <Button variant="accent" className="h-11" loading={busy === 'pay'} disabled={!!busy} onClick={() => act('pay')}>Tôi đã chuyển khoản</Button>
              </div>
            </section>
          )}

          {booking.status === 'paid' && (
            <section className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-card">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white"><Icon name="check" size={36} strokeWidth={3} /></span>
              <h2 className="mt-3 text-xl font-bold text-primary">Đặt lịch thành công!</h2>
              <p className="mt-1 text-sm text-muted">Chủ sân sẽ liên hệ với bạn qua số {booking.customerPhone} nếu cần.</p>
            </section>
          )}

          {booking.status === 'cancelled' && (
            <p className="rounded-xl bg-danger-soft p-4 text-center text-[15px] text-danger">Lịch đặt này đã được huỷ.</p>
          )}

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Link to="/" className="flex h-11 items-center justify-center rounded bg-white font-bold text-primary shadow-card">Về trang chủ</Link>
            <Link to="/account" className="flex h-11 items-center justify-center rounded bg-primary font-bold text-white">Xem lịch đã đặt</Link>
          </div>
        </div>
      )}
    </div>
  );
}
