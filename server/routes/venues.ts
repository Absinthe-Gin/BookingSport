import { Router } from 'express';
import { computeAvailability, getVenue, listVenues } from '../lib/venues.ts';
import { addDays, isValidDate, todayVN } from '../lib/time.ts';
import { DEFAULT_LOCATION, distanceKm } from '../../shared/schedule.ts';

export const venuesRouter = Router();

function strip(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

venuesRouter.get('/', (req, res) => {
  const q = typeof req.query.q === 'string' ? strip(req.query.q.trim()) : '';
  const sports = typeof req.query.sports === 'string' && req.query.sports ? req.query.sports.split(',') : [];
  const lat = Number(req.query.lat) || DEFAULT_LOCATION.lat;
  const lng = Number(req.query.lng) || DEFAULT_LOCATION.lng;
  const maxKm = Number(req.query.maxKm) || Infinity;
  const slugs = typeof req.query.slugs === 'string' ? new Set(req.query.slugs.split(',')) : null;

  const venues = listVenues()
    .map((v) => ({ ...v, distanceKm: distanceKm(lat, lng, v.lat, v.lng) }))
    .filter((v) => !q || strip(`${v.name} ${v.address}`).includes(q))
    .filter((v) => !sports.length || sports.includes(v.sport))
    .filter((v) => v.distanceKm <= maxKm)
    .filter((v) => !slugs || slugs.has(v.slug))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  res.json({ venues });
});

venuesRouter.get('/:slug', (req, res) => {
  const venue = getVenue(req.params.slug);
  if (!venue) return res.status(404).json({ message: 'Không tìm thấy sân' });
  res.json({ venue });
});

venuesRouter.get('/:slug/availability', (req, res) => {
  const venue = getVenue(req.params.slug);
  if (!venue) return res.status(404).json({ message: 'Không tìm thấy sân' });
  const today = todayVN();
  const date = isValidDate(req.query.date) ? req.query.date : today;
  if (date < today || date > addDays(today, 60)) return res.status(400).json({ message: 'Ngày không hợp lệ' });
  res.json({ availability: computeAvailability(venue, date), today });
});
