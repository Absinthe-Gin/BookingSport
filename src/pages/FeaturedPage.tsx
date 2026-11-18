import { useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/feedback/States';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';
import type { Banner } from '@shared/types';

function BannerCard({ banner }: { banner: Banner }) {
  const navigate = useNavigate();
  const external = /^https?:\/\//.test(banner.link);
  const cta = 'absolute right-4 bottom-4 flex h-[27px] items-center rounded bg-accent px-3 text-[11px] font-bold text-white shadow-card hover:bg-accent-dark';
  return (
    <article className="relative overflow-hidden rounded-md shadow-card">
      <img src={banner.image} alt={banner.title} loading="lazy" className="aspect-[2/1] w-full object-cover" />
      <span aria-hidden="true" className="absolute bottom-5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow" />
      {external
        ? <a href={banner.link} target="_blank" rel="noreferrer" className={cta}>{banner.cta}</a>
        : <button type="button" onClick={() => navigate(banner.link)} className={cta}>{banner.cta}</button>}
    </article>
  );
}

export default function FeaturedPage() {
  const banners = useAsync(() => api.banners(), []);
  return (
    <main className="min-h-full bg-page px-4 py-5 lg:px-[30px] lg:py-[30px]">
      <h1 className="sr-only">Nổi bật</h1>
      {banners.loading ? <LoadingBlock /> : banners.error ? <ErrorState message={banners.error.message} onRetry={banners.reload} />
        : !banners.data?.length ? <EmptyState message="Chưa có chương trình nổi bật" />
        : (
          <div className="grid gap-[11px] md:grid-cols-2 lg:gap-x-[30px]">
            {banners.data.map((b) => <BannerCard key={b.id} banner={b} />)}
          </div>
        )}
    </main>
  );
}
