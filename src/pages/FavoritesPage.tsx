import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { VenueGrid } from '@/features/venues/components/VenueGrid';
import { VenueDetailPanel } from '@/features/venues/components/VenueDetailPanel';
import { BookingTypeModal } from '@/features/venues/components/BookingTypeModal';
import { useFavorites } from '@/app/providers/FavoritesProvider';
import { useLocation } from '@/app/providers/LocationProvider';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';

export default function FavoritesPage() {
  const { slugs } = useFavorites();
  const { location } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);
  const [book, setBook] = useState<string | null>(null);
  const key = slugs.join(',');
  const venues = useAsync(
    () => (slugs.length ? api.venues({ slugs, lat: location.lat, lng: location.lng }) : Promise.resolve([])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, location.lat, location.lng],
  );
  const close = useCallback(() => setOpen(null), []);

  return (
    <div>
      <PageHeader title="Sân yêu thích" onBack={() => navigate('/')} />
      <main className="pt-3">
        <VenueGrid venues={venues.data?.filter((v) => slugs.includes(v.slug))} loading={venues.loading} error={venues.error} onRetry={venues.reload}
          onOpen={setOpen} onBook={setBook} emptyMessage="Chưa có sân yêu thích" />
      </main>
      {open && <VenueDetailPanel slug={open} onClose={close} onBook={setBook} />}
      <BookingTypeModal slug={book} onClose={() => setBook(null)} />
    </div>
  );
}
