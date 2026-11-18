import type { BookingStatus } from '@shared/types';

const styles: Record<BookingStatus, { label: string; cls: string }> = {
  pending_payment: { label: 'Chờ thanh toán', cls: 'bg-warning-soft text-warning' },
  paid: { label: 'Đã thanh toán', cls: 'bg-primary-soft text-primary' },
  cancelled: { label: 'Đã huỷ', cls: 'bg-danger-soft text-danger' },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const s = styles[status];
  return <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>;
}
