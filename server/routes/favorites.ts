import { Router } from 'express';
import { db } from '../db.ts';
import { requireAuth, type AuthedRequest } from '../lib/auth.ts';
import { getVenue } from '../lib/venues.ts';

export const favoritesRouter = Router();
favoritesRouter.use(requireAuth);

favoritesRouter.get('/', (req: AuthedRequest, res) => {
  const rows = db.prepare('SELECT venue_slug FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as { venue_slug: string }[];
  res.json({ slugs: rows.map((r) => r.venue_slug) });
});

favoritesRouter.put('/:slug', (req: AuthedRequest, res) => {
  if (!getVenue(req.params.slug as string)) return res.status(404).json({ message: 'Không tìm thấy sân' });
  db.prepare('INSERT OR IGNORE INTO favorites (user_id, venue_slug) VALUES (?, ?)').run(req.user!.id, req.params.slug as string);
  res.status(204).end();
});

favoritesRouter.delete('/:slug', (req: AuthedRequest, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND venue_slug = ?').run(req.user!.id, req.params.slug as string);
  res.status(204).end();
});
