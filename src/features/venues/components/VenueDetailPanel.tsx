import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/feedback/States';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';
import { useFavorites } from '@/app/providers/FavoritesProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { sportColor, sportLabel } from '@/constants/sports';
import type { Venue } from '@shared/types';
import { PriceTable } from './PriceTable';
import { bookingLink, directionsUrl, hoursLabel } from '../utils';

const TABS = ['Thông tin', 'Gói hội viên', 'Dịch vụ', 'Hình ảnh', 'Điều khoản & quy định', 'Đánh giá'] as const;
type Tab = (typeof TABS)[number];

function GlobeIllustration() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
      <circle cx="55" cy="68" r="38" fill="#3b82f6" />
      <path d="M30 50c8 2 10 10 18 9s6 10 14 12-2 14-10 18c-10-2-20-10-24-20s-4-14 2-19zm40-10c8 0 18 8 20 16-6 2-10-4-16-2s-10-6-4-14z" fill="#3ecf8e" />
      <path d="M55 8c-11 0-20 9-20 20 0 15 20 32 20 32s20-17 20-32C75 17 66 8 55 8z" fill="#f05252" />
      <circle cx="55" cy="28" r="8" fill="#fde2e2" />
      <path d="M45 58h20l-4 8H49z" fill="#8b5a2b" />
    </svg>
  );
}

function TabContent({ tab, venue, onImage }: { tab: Tab; venue: Venue; onImage: (src: string) => void }) {
  const toast = useToast();
  switch (tab) {
    case 'Thông tin': {
      const link = bookingLink(venue.slug);
      return (
        <div className="p-2.5">
          <h3 className="text-[19px] font-semibold text-distance">Link đặt lịch online</h3>
          <div className="mt-2 flex items-center gap-3">
            <a href={link} className="min-w-0 flex-1 truncate text-[15px] text-primary-deep italic">{link}</a>
            <button type="button" aria-label="Sao chép link đặt lịch" className="text-primary"
              onClick={() => navigator.clipboard?.writeText(link).then(() => toast.show('Đã sao chép link đặt lịch'), () => toast.show('Không thể sao chép', 'error'))}>
              <Icon name="copy" size={24} />
            </button>
          </div>
        </div>
      );
    }
    case 'Gói hội viên':
      return <EmptyState icon={<GlobeIllustration />} message="Chi nhánh này chưa có gói hội viên nào" />;
    case 'Dịch vụ':
      return (
        <div className="p-2.5">
          <h3 className="mb-3 text-[15px] font-bold text-primary">BẢNG GIÁ SÂN</h3>
          <PriceTable title={venue.priceTitle} rows={venue.priceTable} />
          {venue.dataSource === 'estimated' && <p className="mt-2 text-xs text-muted italic">Bảng giá tham khảo, vui lòng liên hệ sân để biết giá chính xác.</p>}
        </div>
      );
    case 'Hình ảnh':
      return (
        <div className="p-2.5">
          <h3 className="mb-3 text-[15px] font-bold text-primary">Hình ảnh</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {venue.gallery.map((src) => (
              <button key={src} type="button" onClick={() => onImage(src)} className="aspect-[1.2] overflow-hidden rounded-md bg-primary-soft">
                <img src={src} alt={`Hình ảnh ${venue.name}`} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      );
    case 'Điều khoản & quy định':
      return <p className="py-24 text-center text-[15px] text-ink">Sân này chưa cập nhật điều khoản.</p>;
    case 'Đánh giá':
      return <p className="py-24 text-center text-[15px] text-primary">Hiện tại chưa có lượt đánh giá nào.</p>;
  }
}

export function VenueDetailPanel({ slug, onClose, onBook }: { slug: string; onClose: () => void; onBook: (slug: string) => void }) {
  const { data: venue, error, loading, reload } = useAsync(() => api.venue(slug), [slug]);
  const [tab, setTab] = useState<Tab>('Thông tin');
  const [image, setImage] = useState<string | null>(null);
  const { isFavorite, toggle } = useFavorites();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { setTab('Thông tin'); }, [slug]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !image) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, image]);

  const fav = isFavorite(slug);

  return createPortal(
    <>
      <div className="fixed inset-x-0 top-0 bottom-20 z-(--z-panel) bg-black/25 lg:bg-transparent" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="false" aria-label={venue?.name ?? 'Thông tin sân'}
        className="animate-slide-left fixed top-0 bottom-20 left-0 z-(--z-panel) w-full overflow-y-auto bg-white shadow-2xl sm:w-[592px]">
        {loading && <LoadingBlock />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {venue && (
          <>
            <div className="relative h-[200px] bg-primary-soft">
              <img src={venue.cover} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={onClose} aria-label="Đóng" className="absolute top-12 left-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-deep shadow-card">
                <Icon name="arrow-left" size={26} strokeWidth={2.6} />
              </button>
              <div className="absolute top-12 right-2.5 flex items-center gap-3">
                <a href={directionsUrl(venue)} target="_blank" rel="noreferrer" aria-label="Chỉ đường" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-deep shadow-card">
                  <Icon name="route" size={24} />
                </a>
                <button type="button" onClick={() => toggle(venue.slug)} aria-pressed={fav} aria-label={fav ? 'Bỏ yêu thích' : 'Yêu thích'}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-deep shadow-card">
                  <Icon name={fav ? 'heart-fill' : 'heart'} size={22} className={fav ? 'text-danger' : ''} />
                </button>
                <button type="button" onClick={() => onBook(venue.slug)} className="h-10 rounded-md bg-accent px-6 text-[15px] font-bold text-white hover:bg-accent-dark">Đặt lịch</button>
              </div>
            </div>

            <div className="relative -mt-[92px] px-2.5">
              <div className="relative z-10 mb-[-24px] flex justify-center gap-2.5">
                <button type="button" onClick={() => setTab('Đánh giá')} className="flex h-12 items-center gap-2 rounded-full bg-teal px-5 text-[17px] text-white shadow-card">
                  <Icon name="star" size={24} />{venue.rating ? `${venue.rating} / 5` : 'Chưa có đánh giá'}
                </button>
                <button type="button" onClick={() => (user ? toast.show('Tính năng chat sẽ sớm ra mắt') : navigate('/uLogin'))}
                  className="flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-[17px] font-semibold text-white shadow-card">
                  <Icon name="chat" size={22} />Chat với sân
                </button>
              </div>
              <div className="rounded-lg bg-white pt-8 shadow-bar">
                <div className="flex items-center gap-3 px-2.5 pb-3">
                  <Avatar src={venue.avatarThumb} name={venue.name} size={64} />
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-bold text-ink">{venue.name}</h2>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[13px]" style={{ borderColor: sportColor(venue.sport), color: sportColor(venue.sport) }}>
                      <Icon name="level" size={14} />{sportLabel(venue.sport)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 border-t border-line px-3 py-3 text-[15px]">
                  <p className="flex items-center gap-3"><Icon name="map-pin-fill" size={22} className="shrink-0 text-primary" />{venue.address}</p>
                  <p className="flex items-center gap-3"><Icon name="clock-fill" size={22} className="shrink-0 text-primary" />{hoursLabel(venue)}</p>
                  <a href={`tel:${venue.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-brand-green">
                    <Icon name="phone" size={22} className="shrink-0 text-primary" />Liên hệ
                  </a>
                </div>
              </div>
            </div>

            <div role="tablist" className="no-scrollbar mt-4 flex overflow-x-auto border-b border-line">
              {TABS.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`min-w-[86px] flex-1 border-b-2 px-2 pb-2 text-[15px] leading-tight whitespace-normal ${tab === t ? 'border-brand-green font-semibold text-brand-green' : 'border-transparent text-ink'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div role="tabpanel"><TabContent tab={tab} venue={venue} onImage={setImage} /></div>
          </>
        )}
      </aside>
      <Modal open={!!image} onClose={() => setImage(null)} className="max-w-[900px] bg-black">
        {image && <img src={image} alt="" className="max-h-[85vh] w-full object-contain" />}
      </Modal>
    </>,
    document.body,
  );
}
