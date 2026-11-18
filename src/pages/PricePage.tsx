import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorState, LoadingBlock } from '@/components/feedback/States';
import { PriceTable } from '@/features/venues/components/PriceTable';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';

export default function PricePage() {
  const { slug = '' } = useParams();
  const { data: venue, error, loading, reload } = useAsync(() => api.venue(slug), [slug]);
  return (
    <div className="min-h-screen bg-primary text-white">
      <PageHeader title={<span className="font-semibold">Xem sân và bảng giá</span>} />
      <div className="px-2.5 pb-10">
        {loading && <LoadingBlock />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {venue && (
          <>
            <h2 className="mt-2 mb-2 text-[17px] font-bold">Bảng giá sân</h2>
            <PriceTable title={venue.priceTitle} rows={venue.priceTable} tone="onGreen" />
            {venue.dataSource === 'estimated' && <p className="mt-3 text-sm text-white/80 italic">Bảng giá tham khảo, vui lòng liên hệ sân để biết giá chính xác.</p>}
          </>
        )}
      </div>
    </div>
  );
}
