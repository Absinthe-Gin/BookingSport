import type { VenueWithDistance } from '@/services/api';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/feedback/States';
import { VenueCard } from './VenueCard';

interface Props {
  venues: VenueWithDistance[] | undefined;
  loading: boolean;
  error?: Error;
  onRetry: () => void;
  onOpen: (slug: string) => void;
  onBook: (slug: string) => void;
  emptyMessage?: string;
}

export function VenueGrid({ venues, loading, error, onRetry, onOpen, onBook, emptyMessage = 'Không tìm thấy sân phù hợp' }: Props) {
  if (loading && !venues) return <LoadingBlock className="py-40" />;
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;
  if (!venues?.length) return <EmptyState message={emptyMessage} />;
  return (
    <div className="grid grid-cols-1 gap-x-3.5 gap-y-3 px-2 sm:grid-cols-2 lg:grid-cols-3 lg:px-2.5">
      {venues.map((v) => <VenueCard key={v.slug} venue={v} onOpen={onOpen} onBook={onBook} />)}
    </div>
  );
}
