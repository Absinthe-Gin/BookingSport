import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { seedIfEmpty } from './seed.ts';
import { optionalAuth } from './lib/auth.ts';
import { authRouter } from './routes/auth.ts';
import { venuesRouter } from './routes/venues.ts';
import { bookingsRouter } from './routes/bookings.ts';
import { favoritesRouter } from './routes/favorites.ts';
import { socialRouter } from './routes/social.ts';
import { contentRouter } from './routes/content.ts';

seedIfEmpty();

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use('/api', optionalAuth);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/social', socialRouter);
app.use('/api/content', contentRouter);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Không tìm thấy' }));

// Serves the built frontend in production.
const dist = path.join(import.meta.dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
