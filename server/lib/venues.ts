import { db } from '../db.ts';
import type { Availability, EventBlock, SlotState, Venue } from '../../shared/types.ts';
import { SLOT_MINUTES, slotCount } from '../../shared/schedule.ts';
import { seededRandom } from './random.ts';
import { levelPool } from '../data/social.ts';
import { nowMinutesVN, todayVN } from './time.ts';

interface VenueRow {
  id: number; slug: string; name: string; address: string; sport: string; open_hour: number; close_hour: number;
  rating: number | null; lat: number; lng: number; phone: string; courts_json: string; price_json: string;
  price_title: string; gallery_json: string; full_images: number; has_events: number; data_source: string;
}

function toVenue(r: VenueRow): Venue {
  const base = `/assets/images/venues/${r.slug}`;
  return {
    id: r.id, slug: r.slug, name: r.name, address: r.address, sport: r.sport as Venue['sport'],
    openHour: r.open_hour, closeHour: r.close_hour, rating: r.rating, lat: r.lat, lng: r.lng, phone: r.phone,
    cover: `${base}/cover${r.full_images ? '' : '-thumb'}.jpg`, coverThumb: `${base}/cover-thumb.jpg`,
    avatar: `${base}/avatar${r.full_images ? '' : '-thumb'}.jpg`, avatarThumb: `${base}/avatar-thumb.jpg`,
    courts: JSON.parse(r.courts_json), priceTable: JSON.parse(r.price_json), priceTitle: r.price_title,
    gallery: JSON.parse(r.gallery_json), hasEvents: !!r.has_events, dataSource: r.data_source as Venue['dataSource'],
  };
}

export function listVenues(): Venue[] {
  return (db.prepare('SELECT * FROM venues ORDER BY id').all() as unknown as VenueRow[]).map(toVenue);
}

export function getVenue(slug: string): Venue | null {
  const row = db.prepare('SELECT * FROM venues WHERE slug = ?').get(slug) as VenueRow | undefined;
  return row ? toVenue(row) : null;
}

/**
 * Simulated occupancy so the grid looks like a busy real venue, merged with real bookings from the DB.
 * The same venue + date + court always gives the same pattern.
 */
export function computeAvailability(venue: Venue, date: string): Availability {
  const n = slotCount(venue.openHour, venue.closeHour);
  const today = todayVN();
  const pastBefore = date < today ? n : date === today ? Math.ceil((nowMinutesVN() - venue.openHour * 60) / SLOT_MINUTES) : 0;
  const cells: SlotState[][] = [];
  const events: EventBlock[] = [];

  venue.courts.forEach((_, court) => {
    const rand = seededRandom(`${venue.slug}|${date}|${court}`);
    const row: SlotState[] = Array(n).fill('free');
    let i = 0;
    while (i < n) {
      const r = rand();
      const len = 2 + Math.floor(rand() * 4);
      if (r < 0.32) {
        for (let k = i; k < Math.min(n, i + len); k++) row[k] = 'booked';
        i += len;
      } else if (r < 0.38) {
        for (let k = i; k < Math.min(n, i + 2); k++) row[k] = 'locked';
        i += 2;
      } else {
        i += 1 + Math.floor(rand() * 3);
      }
    }
    if (venue.hasEvents && court === venue.courts.length - 1 && rand() < 0.7) {
      const start = Math.min(n - 6, 4 + Math.floor(rand() * 8));
      if (start >= 0) {
        for (let k = start; k < start + 6; k++) row[k] = 'event';
        const lvl = levelPool[Math.floor(rand() * levelPool.length)];
        events.push({ court, startSlot: start, endSlot: start + 6, label: `[Xé vé] - ${lvl.title}, free 1 aqua và có host`, level: lvl.level, taken: Math.floor(rand() * 8), capacity: 8 });
      }
    }
    cells.push(row);
  });

  const realSlots = db.prepare('SELECT court, slot FROM booking_slots WHERE venue_slug = ? AND date = ?').all(venue.slug, date) as { court: number; slot: number }[];
  for (const s of realSlots) if (cells[s.court] && s.slot < n) cells[s.court][s.slot] = 'booked';

  for (const row of cells) for (let k = 0; k < Math.min(pastBefore, n); k++) if (row[k] !== 'event') row[k] = 'past';

  return { venueSlug: venue.slug, date, startHour: venue.openHour, slotMinutes: SLOT_MINUTES, courts: venue.courts, cells, events };
}
