import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorState, LoadingBlock } from '@/components/feedback/States';
import { DateStrip } from '@/features/booking/components/DateStrip';
import { Legend } from '@/features/booking/components/Legend';
import { BookingGrid } from '@/features/booking/components/BookingGrid';
import { SummaryBar } from '@/features/booking/components/SummaryBar';
import { loadDraft, saveDraft } from '@/features/booking/draft';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/app/providers/ToastProvider';
import { api } from '@/services/api';
import { groupSlots, slotPrice, slotToTime, SLOT_MINUTES } from '@shared/schedule';
import type { SelectedSlot } from '@shared/types';

export default function BookingPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const draft = useMemo(() => loadDraft(slug), [slug]);
  const [date, setDate] = useState<string | undefined>(draft?.date);
  const [selected, setSelected] = useState<SelectedSlot[]>(draft?.slots ?? []);
  const [cellWidth, setCellWidth] = useState(40);
  const [submitting, setSubmitting] = useState(false);

  const venue = useAsync(() => api.venue(slug), [slug]);
  const avail = useAsync(() => api.availability(slug, date), [slug, date]);
  const today = avail.data?.today;
  const availability = avail.data?.availability;

  useEffect(() => { if (!date && today) setDate(today); }, [date, today]);

  // Drop selections that became unavailable after a refresh.
  useEffect(() => {
    if (!availability) return;
    setSelected((sel) => sel.filter((s) => availability.cells[s.court]?.[s.slot] === 'free'));
  }, [availability]);

  const summary = useMemo(() => {
    if (!venue.data || !availability) return { lines: [], totalMinutes: 0, totalPrice: 0 };
    const v = venue.data;
    const lines = groupSlots(selected).map((g) => {
      let price = 0;
      for (let k = g.startSlot; k < g.endSlot; k++) price += slotPrice(v.priceTable, v.openHour, k);
      return { ...g, courtName: v.courts[g.court], startTime: slotToTime(v.openHour, g.startSlot), endTime: slotToTime(v.openHour, g.endSlot), price };
    });
    return { lines, totalMinutes: selected.length * SLOT_MINUTES, totalPrice: lines.reduce((s, l) => s + l.price, 0) };
  }, [selected, venue.data, availability]);

  const toggle = (s: SelectedSlot) => setSelected((sel) =>
    sel.some((x) => x.court === s.court && x.slot === s.slot) ? sel.filter((x) => !(x.court === s.court && x.slot === s.slot)) : [...sel, s]);

  const changeDate = (d: string) => { setDate(d); setSelected([]); };

  const next = async () => {
    if (!date || !selected.length) { toast.show('Vui lòng chọn khung giờ muốn đặt', 'error'); return; }
    setSubmitting(true);
    try {
      await api.quote(slug, date, selected);
      saveDraft({ venueSlug: slug, date, slots: selected });
      navigate(`/userBooking/${slug}/confirm`);
    } catch (e) {
      toast.show((e as Error).message, 'error');
      avail.reload();
    } finally {
      setSubmitting(false);
    }
  };

  const error = venue.error ?? avail.error;
  return (
    <div className="min-h-screen bg-primary-soft pb-40">
      <div className="bg-primary">
        <PageHeader title="ĐẶT LỊCH THEO SÂN - TRỰC QUAN" />
        <div className="px-2.5">{today && date && <DateStrip today={today} value={date} onChange={changeDate} />}</div>
        <Legend priceHref={`/userBooking/${slug}/prices`} onEvents={() => navigate('/socialNearby')} />
      </div>
      {venue.data && (
        <p className="px-2.5 py-1.5 text-center text-sm text-ink">
          <span className="text-distance">Lưu ý: </span>
          Nếu bạn cần đặt lịch cố định vui lòng liên hệ số điện thoại {venue.data.phone} để được hỗ trợ
        </p>
      )}
      {error ? <ErrorState message={error.message} onRetry={() => { venue.reload(); avail.reload(); }} />
        : !availability || avail.loading ? <LoadingBlock />
        : <BookingGrid availability={availability} selected={selected} onToggle={toggle} onEvent={() => navigate('/socialNearby')} cellWidth={cellWidth} />}

      <div className="fixed right-2.5 z-(--z-nav) flex h-[50px] w-[300px] max-w-[calc(100vw-20px)] items-center rounded-[14px] border border-[#c5d0ca] bg-white px-4 shadow-card"
        style={{ bottom: summary.lines.length ? 142 : 70 }}>
        <label className="sr-only" htmlFor="zoom">Phóng to bảng giờ</label>
        <input id="zoom" type="range" min={32} max={96} step={4} value={cellWidth} onChange={(e) => setCellWidth(Number(e.target.value))}
          className="w-full accent-brand-green" />
      </div>

      {venue.data && (
        <SummaryBar lines={summary.lines} totalMinutes={summary.totalMinutes} totalPrice={summary.totalPrice}
          quoting={submitting} onNext={next} />
      )}
    </div>
  );
}
