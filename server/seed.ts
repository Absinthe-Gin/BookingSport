import { db, transaction } from './db.ts';
import { venueSeeds } from './data/venues.ts';
import { socialVenueSeeds } from './data/social.ts';
import { banners, feedPosts } from './data/content.ts';
import { DEFAULT_LOCATION } from '../shared/schedule.ts';

function offset(distanceM: number, bearingDeg: number) {
  const b = (bearingDeg * Math.PI) / 180;
  const dLat = (distanceM * Math.cos(b)) / 111320;
  const dLng = (distanceM * Math.sin(b)) / (111320 * Math.cos((DEFAULT_LOCATION.lat * Math.PI) / 180));
  return { lat: DEFAULT_LOCATION.lat + dLat, lng: DEFAULT_LOCATION.lng + dLng };
}

export function seedIfEmpty(force = false) {
  const count = (db.prepare('SELECT COUNT(*) AS n FROM venues').get() as { n: number }).n;
  if (count > 0 && !force) return false;

  transaction(() => {
    if (force) {
      for (const t of ['social_joins', 'social_sessions', 'social_venues', 'favorites', 'booking_slots', 'bookings', 'feed_posts', 'banners', 'venues']) {
        db.exec(`DELETE FROM ${t}`);
      }
    }
    const insertVenue = db.prepare(`INSERT INTO venues
      (slug, name, address, sport, open_hour, close_hour, rating, lat, lng, phone, courts_json, price_json, price_title, gallery_json, full_images, has_events, data_source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const v of venueSeeds) {
      const { lat, lng } = offset(v.distanceM, v.bearingDeg);
      const base = `/assets/images/venues/${v.slug}`;
      const gallery = [`${base}/cover${v.fullImages ? '' : '-thumb'}.jpg`, `${base}/avatar${v.fullImages ? '' : '-thumb'}.jpg`];
      insertVenue.run(v.slug, v.name, v.address, v.sport, v.openHour, v.closeHour, v.rating, lat, lng, v.phone,
        JSON.stringify(v.courts), JSON.stringify(v.priceTable), v.priceTitle, JSON.stringify(gallery),
        v.fullImages ? 1 : 0, v.hasEvents ? 1 : 0, v.dataSource);
    }

    const insertSocial = db.prepare('INSERT INTO social_venues (slug, name, logo, lat, lng, sport) VALUES (?, ?, ?, ?, ?, ?)');
    for (const s of socialVenueSeeds) {
      const { lat, lng } = offset(s.distanceM, s.bearingDeg);
      insertSocial.run(s.slug, s.name, s.logo, lat, lng, s.sport);
    }

    const insertPost = db.prepare('INSERT INTO feed_posts (kind, posted_at, json) VALUES (?, ?, ?)');
    for (const p of feedPosts) insertPost.run(p.kind, p.postedAt, JSON.stringify(p));

    const insertBanner = db.prepare('INSERT INTO banners (title, image, cta, link) VALUES (?, ?, ?, ?)');
    for (const b of banners) insertBanner.run(b.title, b.image, b.cta, b.link);
  });
  return true;
}

if (import.meta.main) {
  seedIfEmpty(process.argv.includes('--force'));
  console.log('Seed complete');
}
