import type { MouseEvent } from 'react';
import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { useFavorites } from '@/app/providers/FavoritesProvider';
import { formatDistance } from '@shared/schedule';
import type { VenueWithDistance } from '@/services/api';
import { directionsUrl, hoursLabel } from '../utils';

interface Props {
  venue: VenueWithDistance;
  onOpen: (slug: string) => void;
  onBook: (slug: string) => void;
}

export function VenueTags({ rating }: { rating: number | null }) {
  return (
    <div className="flex items-center">
      <span className="relative z-20 flex h-[22px] items-center gap-1 rounded-full bg-white px-1.5 text-xs font-semibold text-ink">
        <Icon name="star" size={15} className={rating ? 'text-accent' : 'text-[#9aa29e]'} />
        {rating ? <span>{rating}</span> : null}
      </span>
      <span className="relative z-10 -ml-3 flex h-[22px] items-center rounded-full bg-brand-green pr-3 pl-4 text-xs font-medium text-white">Đơn ngày</span>
      <span className="-ml-3 flex h-[22px] items-center rounded-full bg-event pr-3 pl-4 text-xs font-medium text-white">Sự kiện</span>
    </div>
  );
}

export function VenueCard({ venue, onOpen, onBook }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(venue.slug);
  const stop = (fn: () => void) => (e: MouseEvent) => { e.stopPropagation(); fn(); };

  return (
    <article className="group relative cursor-pointer overflow-hidden rounded-md bg-white shadow-card transition-shadow hover:shadow-bar"
      onClick={() => onOpen(venue.slug)}>
      <div className="relative h-[116px] overflow-hidden bg-primary-soft">
        <img src={venue.coverThumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        <div className="absolute top-1.5 left-1.5"><VenueTags rating={venue.rating} /></div>
        <div className="absolute top-2.5 right-2.5 flex gap-2.5">
          <button type="button" onClick={stop(() => toggle(venue.slug))} aria-pressed={fav}
            aria-label={fav ? `Bỏ yêu thích ${venue.name}` : `Yêu thích ${venue.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-deep shadow-card">
            <Icon name={fav ? 'heart-fill' : 'heart'} size={22} className={fav ? 'text-danger' : ''} />
          </button>
          <a href={directionsUrl(venue)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
            aria-label={`Chỉ đường tới ${venue.name}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-deep shadow-card">
            <Icon name="route" size={22} />
          </a>
        </div>
      </div>
      <div className="flex h-[84px] items-center gap-2.5 px-1.5">
        <Avatar src={venue.avatarThumb} name={venue.name} size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] leading-[18px] font-bold text-ink">{venue.name}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">
            <span className="text-distance">({formatDistance(venue.distanceKm)})</span> {venue.address}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted"><Icon name="clock" size={13} />{hoursLabel(venue)}</p>
        </div>
        <button type="button" onClick={stop(() => onBook(venue.slug))}
          className="mr-1 h-[30px] shrink-0 rounded bg-accent px-3 text-[13px] font-bold text-white hover:bg-accent-dark">
          ĐẶT LỊCH
        </button>
      </div>
    </article>
  );
}
