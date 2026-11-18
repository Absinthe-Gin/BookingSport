import { Router } from 'express';
import { db, transaction } from '../db.ts';
import { normalizePhone, type AuthedRequest } from '../lib/auth.ts';
import { seededRandom } from '../lib/random.ts';
import { addDays, isValidDate, nowMinutesVN, todayVN } from '../lib/time.ts';
import { levelPool, socialVenueSeeds } from '../data/social.ts';
import { DEFAULT_LOCATION, distanceKm } from '../../shared/schedule.ts';
import type { SocialSession, SocialVenue } from '../../shared/types.ts';

export const socialRouter = Router();

const OBSERVED_DATE = '2026-11-18';

function addHours(time: string, h: number): string {
  const [hh, mm] = time.split(':').map(Number);
  const total = Math.min(24 * 60, hh * 60 + mm + h * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Creates the sessions for a date the first time it is requested. */
function ensureSessions(date: string) {
  if (db.prepare('SELECT 1 FROM social_sessions WHERE date = ? LIMIT 1').get(date)) return;
  const ins = db.prepare(`INSERT INTO social_sessions (venue_slug, date, start_time, end_time, title, level, court, taken, capacity, price, sport, simulated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  transaction(() => {
    for (const v of socialVenueSeeds) {
      const rand = seededRandom(`${v.slug}|${date}`);
      const times = date === OBSERVED_DATE ? v.todayTimes : v.todayTimes.filter(() => rand() > 0.25);
      let first = true;
      for (const t of times) {
        for (let k = 0; k < Math.min(t.sessions, 3); k++) {
          const lvl = levelPool[Math.floor(rand() * levelPool.length)];
          const useObserved = first && date === OBSERVED_DATE;
          const o = v.observedTicket;
          const capacity = useObserved ? o.capacity : rand() < 0.2 ? 16 : 8;
          ins.run(v.slug, date, t.time, addHours(t.time, t.durationH),
            useObserved ? o.title : lvl.title, useObserved ? o.level : lvl.level,
            useObserved ? o.court : `Sân ${1 + Math.floor(rand() * 10)}`,
            useObserved ? o.taken : Math.floor(rand() * capacity), capacity,
            useObserved ? o.price : [60000, 70000, 80000, 90000, 100000][Math.floor(rand() * 5)],
            v.sport, useObserved ? 0 : 1);
          first = false;
        }
      }
    }
  });
}

interface SessionRow {
  id: number; venue_slug: string; date: string; start_time: string; end_time: string; title: string; level: string;
  court: string; taken: number; capacity: number; price: number; sport: string; simulated: number;
}

function toSession(r: SessionRow): SocialSession {
  return {
    id: r.id, venueSlug: r.venue_slug, date: r.date, startTime: r.start_time, endTime: r.end_time, title: r.title,
    level: r.level, court: r.court, taken: r.taken, capacity: r.capacity, price: r.price,
    sport: r.sport as SocialSession['sport'], simulated: !!r.simulated,
  };
}

socialRouter.get('/', (req, res) => {
  const today = todayVN();
  const date = isValidDate(req.query.date) ? req.query.date : today;
  if (date < today || date > addDays(today, 30)) return res.status(400).json({ message: 'Ngày không hợp lệ' });
  ensureSessions(date);

  const lat = Number(req.query.lat) || DEFAULT_LOCATION.lat;
  const lng = Number(req.query.lng) || DEFAULT_LOCATION.lng;
  const radiusKm = Number(req.query.radiusKm) || 20;
  const sport = typeof req.query.sport === 'string' && req.query.sport !== 'all' ? req.query.sport : null;
  const onlyOpen = req.query.onlyOpen === '1';
  const period = String(req.query.period ?? 'all');
  const price = String(req.query.price ?? 'all');
  const sort = String(req.query.sort ?? 'soonest');

  const venues = (db.prepare('SELECT * FROM social_venues').all() as unknown as SocialVenue[])
    .map((v) => ({ ...v, distanceKm: distanceKm(lat, lng, v.lat, v.lng) }))
    .filter((v) => v.distanceKm <= radiusKm && (!sport || v.sport === sport));
  const venueMap = new Map(venues.map((v) => [v.slug, v]));

  const nowMin = date === today ? nowMinutesVN() : -1;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  let sessions = (db.prepare('SELECT * FROM social_sessions WHERE date = ?').all(date) as unknown as SessionRow[])
    .map(toSession)
    .filter((s) => venueMap.has(s.venueSlug))
    .filter((s) => !onlyOpen || s.taken < s.capacity)
    .filter((s) => {
      const h = toMin(s.startTime) / 60;
      return period === 'morning' ? h < 12 : period === 'afternoon' ? h >= 12 && h < 18 : period === 'evening' ? h >= 18 : true;
    })
    .filter((s) => price === 'free' ? s.price === 0 : price === 'lt100' ? s.price < 100000 : price === '100to200' ? s.price >= 100000 && s.price <= 200000 : price === 'gt200' ? s.price > 200000 : true)
    .map((s) => ({ ...s, live: nowMin >= toMin(s.startTime) && nowMin < toMin(s.endTime) }));

  const sorters: Record<string, (a: typeof sessions[number], b: typeof sessions[number]) => number> = {
    soonest: (a, b) => a.startTime.localeCompare(b.startTime),
    nearest: (a, b) => venueMap.get(a.venueSlug)!.distanceKm - venueMap.get(b.venueSlug)!.distanceKm,
    cheapest: (a, b) => a.price - b.price,
    mostOpen: (a, b) => (b.capacity - b.taken) - (a.capacity - a.taken),
    busiest: (a, b) => b.taken - a.taken,
  };
  sessions = sessions.sort(sorters[sort] ?? sorters.soonest);

  const groups = venues
    .map((v) => ({ venue: v, sessions: sessions.filter((s) => s.venueSlug === v.slug) }))
    .filter((g) => g.sessions.length > 0)
    .sort((a, b) => sort === 'soonest' || sort === 'cheapest' || sort === 'mostOpen' || sort === 'busiest'
      ? sessions.indexOf(a.sessions[0]) - sessions.indexOf(b.sessions[0])
      : a.venue.distanceKm - b.venue.distanceKm);

  res.json({ date, today, totalVenues: groups.length, totalSessions: sessions.length, groups });
});

socialRouter.post('/:id/join', (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const { name, phone, quantity } = req.body ?? {};
  const qty = Number(quantity) || 1;
  const cleanName = typeof name === 'string' && name.trim() ? name.trim() : req.user?.fullName ?? '';
  const cleanPhone = normalizePhone(phone) ?? req.user?.phone ?? null;
  const errors: Record<string, string> = {};
  if (cleanName.length < 2) errors.name = 'Vui lòng nhập tên của bạn';
  if (!cleanPhone) errors.phone = 'Số điện thoại không hợp lệ';
  if (!Number.isInteger(qty) || qty < 1 || qty > 4) errors.quantity = 'Số vé từ 1 đến 4';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Thông tin không hợp lệ', errors });

  const result = transaction(() => {
    const row = db.prepare('SELECT * FROM social_sessions WHERE id = ?').get(id) as SessionRow | undefined;
    if (!row) return { status: 404, message: 'Không tìm thấy buổi chơi' };
    if (row.taken + qty > row.capacity) return { status: 409, message: 'Buổi chơi không còn đủ chỗ' };
    db.prepare('UPDATE social_sessions SET taken = taken + ? WHERE id = ?').run(qty, id);
    db.prepare('INSERT INTO social_joins (session_id, user_id, name, phone, quantity) VALUES (?, ?, ?, ?, ?)').run(id, req.user?.id ?? null, cleanName, cleanPhone, qty);
    return { status: 200, session: toSession({ ...row, taken: row.taken + qty }) };
  });
  if (result.status !== 200) return res.status(result.status).json({ message: result.message });
  res.json({ session: result.session });
});
