import { Router } from 'express';
import { db } from '../db.ts';
import type { Banner, FeedKind, FeedPost } from '../../shared/types.ts';

export const contentRouter = Router();

contentRouter.get('/banners', (_req, res) => {
  res.json({ banners: db.prepare('SELECT id, title, image, cta, link FROM banners ORDER BY id').all() as unknown as Banner[] });
});

const KINDS: FeedKind[] = ['event', 'membership', 'course', 'notice'];

contentRouter.get('/feed', (req, res) => {
  const kind = String(req.query.kind ?? '');
  if (!KINDS.includes(kind as FeedKind)) return res.json({ posts: [] });
  const rows = db.prepare('SELECT id, json FROM feed_posts WHERE kind = ? ORDER BY posted_at DESC').all(kind) as { id: number; json: string }[];
  res.json({ posts: rows.map((r) => ({ id: r.id, ...JSON.parse(r.json) }) as FeedPost) });
});
