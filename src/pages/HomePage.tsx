import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { HomeToolbar } from '@/components/navigation/HomeToolbar';
import { VenueGrid } from '@/features/venues/components/VenueGrid';
import { VenueDetailPanel } from '@/features/venues/components/VenueDetailPanel';
import { BookingTypeModal } from '@/features/venues/components/BookingTypeModal';
import { Onboarding, hasSeenOnboarding } from '@/features/onboarding/Onboarding';
import { useAsync } from '@/hooks/useAsync';
import { useLocation } from '@/app/providers/LocationProvider';
import { api } from '@/services/api';

export default function HomePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { location } = useLocation();
  const [bookSlug, setBookSlug] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState(() => !hasSeenOnboarding());
  const venues = useAsync(() => api.venues({ lat: location.lat, lng: location.lng }), [location.lat, location.lng]);

  const open = useCallback((s: string) => navigate(`/san/${s}`), [navigate]);
  const close = useCallback(() => navigate('/'), [navigate]);

  return (
    <div>
      <HomeHeader />
      <HomeToolbar />
      <main className="pt-3 pb-4 lg:pt-0.5">
        <h1 className="sr-only">Sân thể thao gần bạn</h1>
        <VenueGrid venues={venues.data} loading={venues.loading} error={venues.error} onRetry={venues.reload} onOpen={open} onBook={setBookSlug} />
      </main>
      {slug && <VenueDetailPanel slug={slug} onClose={close} onBook={setBookSlug} />}
      <BookingTypeModal slug={bookSlug} onClose={() => setBookSlug(null)} />
      {onboarding && <Onboarding onDone={() => setOnboarding(false)} />}
    </div>
  );
}
