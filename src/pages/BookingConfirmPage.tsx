import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ErrorState, LoadingBlock } from '@/components/feedback/States';
import { PhoneInput, TextArea, isValidPhone } from '@/components/forms/Fields';
import { clearDraft, loadDraft, rememberBookingPhone } from '@/features/booking/draft';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { ApiError, api } from '@/services/api';
import { formatMinutes, formatVnd } from '@shared/schedule';
import { ddmmyyyy } from '@/utils/date';

const hhmm = (t: string) => t.replace(':', 'h');

function Card({ icon, title, children }: { icon: 'map-fold' | 'ticket'; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[10px] bg-primary-dark px-2.5 py-3">
      <h2 className="mb-2.5 flex items-center gap-2 text-[17px] font-bold text-[#f4e66a]"><Icon name={icon} size={20} />{title}</h2>
      <div className="space-y-3 text-[15px] text-white">{children}</div>
    </section>
  );
}

export default function BookingConfirmPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const draft = useMemo(() => loadDraft(slug), [slug]);
  const venue = useAsync(() => api.venue(slug), [slug]);
  const quote = useAsync(() => (draft ? api.quote(slug, draft.date, draft.slots) : Promise.reject(new Error('no draft'))), [slug, draft]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [card, setCard] = useState<{ file: File; url: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) { setName((n) => n || user.fullName); setPhone((p) => p || user.phone); }
  }, [user]);
  useEffect(() => () => { if (card) URL.revokeObjectURL(card.url); }, [card]);

  if (!draft) return <Navigate to={`/userBooking/${slug}`} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.customerName = 'Vui lòng nhập tên của bạn';
    if (!isValidPhone(phone)) errs.customerPhone = 'Số điện thoại không hợp lệ';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const fullNote = card ? `${note.trim()}${note.trim() ? '\n' : ''}[Có ảnh thẻ HSSV]` : note.trim();
      const booking = await api.createBooking({ venueSlug: slug, date: draft.date, slots: draft.slots, customerName: name, customerPhone: phone, note: fullNote });
      rememberBookingPhone(booking.code, booking.customerPhone);
      clearDraft(slug);
      navigate(`/booking/${booking.code}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.errors).length) setErrors(err.errors);
      toast.show((err as Error).message, 'error');
      if (err instanceof ApiError && err.status === 409) navigate(`/userBooking/${slug}`);
    } finally {
      setSubmitting(false);
    }
  };

  const v = venue.data;
  const q = quote.data;
  return (
    <form onSubmit={submit} noValidate className="min-h-screen bg-primary pb-24">
      <PageHeader title="ĐẶT LỊCH THEO SÂN - TRỰC QUAN" />
      {(venue.loading || quote.loading) && <LoadingBlock />}
      {(venue.error || quote.error) && (
        <div className="text-white"><ErrorState message={(venue.error ?? quote.error)!.message} onRetry={() => navigate(`/userBooking/${slug}`)} /></div>
      )}
      {v && q && (
        <div className="space-y-5 px-2.5">
          <Card icon="map-fold" title="Thông tin sân">
            <p>Tên CLB: <b>{v.name}</b></p>
            <p>Địa chỉ: <b>{v.address}</b></p>
          </Card>
          <Card icon="ticket" title="Thông tin lịch đặt">
            <p>Ngày: <b>{ddmmyyyy(draft.date)}</b></p>
            {q.lines.map((l) => (
              <p key={`${l.court}-${l.startSlot}`} className="font-bold">
                - {l.courtName}: {hhmm(l.startTime)} - {hhmm(l.endTime)} | <span className="font-normal text-[#f4e66a] underline-offset-2">{formatVnd(l.price)}</span>
              </p>
            ))}
            <p>Đối tượng: <b>{v.priceTitle}</b></p>
            <p>Tổng giờ: <b>{formatMinutes(q.totalMinutes)}</b></p>
            <p>Tổng tiền: <b>{formatVnd(q.totalPrice)}</b></p>
          </Card>

          <section className="rounded-[10px] bg-primary-dark px-2.5 py-3 text-white">
            {!user && (
              <>
                <p className="text-center text-[15px]">Đăng nhập để có thể sử dụng ưu đãi</p>
                <div className="mt-2.5 grid grid-cols-2 gap-5 px-2.5">
                  <Link to="/uLogin" state={{ from: `/userBooking/${slug}/confirm` }} className="flex h-8 items-center justify-center rounded bg-accent text-[13px] font-bold">ĐĂNG NHẬP</Link>
                  <Link to="/uRegister" state={{ from: `/userBooking/${slug}/confirm` }} className="flex h-8 items-center justify-center rounded bg-teal text-[13px] font-bold">ĐĂNG KÝ</Link>
                </div>
                <hr className="my-4 border-white/20" />
              </>
            )}
            <p className="flex justify-between text-[15px]"><span>Số tiền cần thanh toán</span><b className="font-semibold">{formatVnd(q.totalPrice)}</b></p>
          </section>

          <button type="button" onClick={() => setServicesOpen(true)} className="h-10 w-full rounded border border-white/80 text-[15px] text-white hover:bg-white/5">Thêm dịch vụ</button>

          <p className="rounded-md bg-warning-soft px-2.5 py-2 text-xs text-warning">Vui lòng nhập thông tin để tiếp tục thanh toán</p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2.5 block text-[15px] font-bold text-white">TÊN CỦA BẠN</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên của bạn" autoComplete="name" aria-invalid={!!errors.customerName}
                className="h-12 w-full rounded bg-white px-4 text-[15px] outline-none placeholder:text-[#8a948f] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger" />
              {errors.customerName && <span className="mt-1 block text-sm text-[#ffd2d2]">{errors.customerName}</span>}
            </label>
            <div>
              <label htmlFor="phone" className="mb-2.5 block text-[15px] font-bold text-white">SỐ ĐIỆN THOẠI</label>
              <PhoneInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" aria-invalid={!!errors.customerPhone} className="h-12 bg-[#f0f0f0]" />
              {errors.customerPhone && <span className="mt-1 block text-sm text-[#ffd2d2]">{errors.customerPhone}</span>}
            </div>
            <label className="block">
              <span className="mb-1 block text-[15px] font-bold text-white">GHI CHÚ CHO CHỦ SÂN</span>
              <TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú" maxLength={400} />
            </label>
            <div>
              <span className="mb-2.5 block text-[15px] font-bold text-white">THẺ HSSV</span>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Tải ảnh xác minh HSSV"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setCard({ file: f, url: URL.createObjectURL(f) }); e.target.value = ''; }} />
              {card ? (
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-white/80">
                  <img src={card.url} alt="Ảnh thẻ HSSV" className="max-h-56 w-full object-contain" />
                  <button type="button" onClick={() => setCard(null)} aria-label="Xoá ảnh" className="absolute top-2 right-2 rounded-full bg-white p-1 text-ink"><Icon name="x" size={18} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex h-[150px] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/80 text-[13px] font-semibold text-white hover:bg-white/5">
                  <Icon name="image-plus" size={44} strokeWidth={1.6} />Tải ảnh xác minh HSSV
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-0 bottom-0 left-0 z-(--z-nav) px-2.5 pb-2.5">
        <Button type="submit" variant="accent" loading={submitting} disabled={!q} className="h-[50px] w-full rounded-md text-base">XÁC NHẬN & THANH TOÁN</Button>
      </div>

      <Modal open={servicesOpen} onClose={() => setServicesOpen(false)} title="Thêm dịch vụ" className="max-w-[480px]">
        <p className="px-6 pt-4 pb-8 text-center text-[15px] text-ink">Sân chưa cập nhật dịch vụ đi kèm.</p>
      </Modal>
    </form>
  );
}
