import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { VenueGrid } from '@/features/venues/components/VenueGrid';
import { VenueDetailPanel } from '@/features/venues/components/VenueDetailPanel';
import { BookingTypeModal } from '@/features/venues/components/BookingTypeModal';
import { FilterPanel } from '@/features/search/components/FilterPanel';
import { PROVINCES, addressMatches, countActive, defaultFilters, type SearchFilters } from '@/features/search/filters';
import { useAsync } from '@/hooks/useAsync';
import { useLocation } from '@/app/providers/LocationProvider';
import { useFavorites } from '@/app/providers/FavoritesProvider';
import { api } from '@/services/api';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { location } = useLocation();
  const { slugs: favSlugs } = useFavorites();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(q);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [open, setOpen] = useState<string | null>(null);
  const [book, setBook] = useState<string | null>(null);
  const panelOpen = params.get('filters') === '1';

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 250);
    return () => window.clearTimeout(t);
  }, [q]);

  const venues = useAsync(
    () => api.venues({ q: debounced, sports: filters.sports, lat: location.lat, lng: location.lng, maxKm: filters.areaMode === 'distance' ? filters.maxKm ?? undefined : undefined }),
    [debounced, filters.sports.join(','), filters.areaMode, filters.maxKm, location.lat, location.lng],
  );

  const shown = useMemo(() => venues.data?.filter((v) =>
    (!filters.ward || addressMatches(v.address, filters.ward)) &&
    (!filters.province || addressMatches(v.address, PROVINCES.find((p) => p.name === filters.province)?.match ?? filters.province)) &&
    (!filters.favoritesOnly || favSlugs.includes(v.slug))), [venues.data, filters, favSlugs]);

  const setPanel = (on: boolean) => {
    const next = new URLSearchParams(params);
    if (on) next.set('filters', '1'); else next.delete('filters');
    setParams(next, { replace: true });
  };
  const close = useCallback(() => setOpen(null), []);
  const active = countActive(filters);

  return (
    <div className="min-h-screen">
      <div className="header-bg pb-3">
        <header className="flex h-14 items-center px-1 text-white">
          <button type="button" onClick={() => navigate(-1)} aria-label="Quay lại" className="flex h-14 w-14 items-center justify-center"><Icon name="chevron-left" size={24} strokeWidth={2.4} /></button>
          <h1 className="flex-1 text-center text-xl font-semibold">Tìm kiếm</h1>
          <span className="w-14" />
        </header>
        <div className="mx-2.5 flex h-12 items-center gap-2 rounded-lg bg-white px-3 shadow-bar">
          <img src="/assets/icons/ic_alobo.png" alt="" className="h-7 w-7 rounded-full" />
          <label htmlFor="search-q" className="sr-only">Tìm sân</label>
          <input id="search-q" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập tên sân, địa chỉ" type="search"
            className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-[#9aa29e]" />
          <button type="button" onClick={() => setPanel(true)} aria-label="Mở bộ lọc" className="relative text-primary">
            <Icon name="sliders" size={22} />
            {active > 0 && <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{active}</span>}
          </button>
        </div>
      </div>
      <main className="pt-3 pb-6">
        {shown && <p className="px-3 pb-2 text-sm text-muted" aria-live="polite">Tìm thấy {shown.length} sân</p>}
        <VenueGrid venues={shown} loading={venues.loading} error={venues.error} onRetry={venues.reload} onOpen={setOpen} onBook={setBook} />
      </main>
      <FilterPanel open={panelOpen} value={filters} onClose={() => setPanel(false)} onApply={(f) => { setFilters(f); setPanel(false); }} />
      {open && <VenueDetailPanel slug={open} onClose={close} onBook={setBook} />}
      <BookingTypeModal slug={book} onClose={() => setBook(null)} />
    </div>
  );
}
