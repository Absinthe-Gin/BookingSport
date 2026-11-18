import { Router } from 'express';
import crypto from 'node:crypto';
import { db, transaction } from '../db.ts';
import { normalizePhone, requireAuth, type AuthedRequest } from '../lib/auth.ts';
import { computeAvailability, getVenue } from '../lib/venues.ts';
import { addDays, isValidDate, todayVN } from '../lib/time.ts';
import { SLOT_MINUTES, groupSlots, slotPrice } from '../../shared/schedule.ts';
import type { Booking, BookingLine } from '../../shared/types.ts';

export const bookingsRouter = Router();

interface BookingRow {
  id: number; code: string; venue_slug: string; date: string; lines_json: string; total_minutes: number;
  total_price: number; customer_name: string; customer_phone: string; note: string; status: string;
  created_at: string; venue_name: string; venue_address: string; user_id: number | null;
}

function isOwner(row: BookingRow, req: AuthedRequest, phoneInput: unknown): boolean {
  if (req.user && (row.user_id === req.user.id || row.customer_phone === req.user.phone)) return true;
  return normalizePhone(phoneInput) === row.customer_phone;
}

const SELECT = `SELECT b.*, v.name AS venue_name, v.address AS venue_address FROM bookings b JOIN venues v ON v.slug = b.venue_slug`;

function toBooking(r: BookingRow): Booking {
  return {
    id: r.id, code: r.code, venueSlug: r.venue_slug, venueName: r.venue_name, venueAddress: r.venue_address,
    date: r.date, lines: JSON.parse(r.lines_json), totalMinutes: r.total_minutes, totalPrice: r.total_price,
    customerName: r.customer_name, customerPhone: r.customer_phone, note: r.note,
    status: r.status as Booking['status'], createdAt: r.created_at,
  };
}

/** Price and validity check shared by the quote and create endpoints. */
function buildQuote(body: unknown): { error: string } | { venue: NonNullable<ReturnType<typeof getVenue>>; date: string; slots: { court: number; slot: number }[]; lines: BookingLine[]; totalMinutes: number; totalPrice: number } {
  const { venueSlug, date, slots } = (body ?? {}) as { venueSlug?: string; date?: string; slots?: unknown };
  const venue = typeof venueSlug === 'string' ? getVenue(venueSlug) : null;
  if (!venue) return { error: 'Không tìm thấy sân' };
  const today = todayVN();
  if (!isValidDate(date) || date < today || date > addDays(today, 60)) return { error: 'Ngày không hợp lệ' };
  if (!Array.isArray(slots) || slots.length === 0 || slots.length > 96) return { error: 'Vui lòng chọn khung giờ' };
  const clean: { court: number; slot: number }[] = [];
  const seen = new Set<string>();
  for (const s of slots) {
    const court = Number((s as { court: unknown }).court);
    const slot = Number((s as { slot: unknown }).slot);
    if (!Number.isInteger(court) || !Number.isInteger(slot)) return { error: 'Khung giờ không hợp lệ' };
    const key = `${court}:${slot}`;
    if (!seen.has(key)) { seen.add(key); clean.push({ court, slot }); }
  }
  const avail = computeAvailability(venue, date);
  for (const s of clean) {
    if (avail.cells[s.court]?.[s.slot] !== 'free') return { error: 'Khung giờ bạn chọn đã có người đặt, vui lòng chọn lại' };
  }
  const lines = groupSlots(clean).map((g) => {
    let price = 0;
    for (let k = g.startSlot; k < g.endSlot; k++) price += slotPrice(venue.priceTable, venue.openHour, k);
    return { ...g, courtName: venue.courts[g.court], price };
  });
  const totalPrice = lines.reduce((s, l) => s + l.price, 0);
  return { venue, date, slots: clean, lines, totalMinutes: clean.length * SLOT_MINUTES, totalPrice };
}

bookingsRouter.post('/quote', (req, res) => {
  const q = buildQuote(req.body);
  if ('error' in q) return res.status(400).json({ message: q.error });
  res.json({ lines: q.lines, totalMinutes: q.totalMinutes, totalPrice: q.totalPrice });
});

bookingsRouter.post('/', (req: AuthedRequest, res) => {
  const q = buildQuote(req.body);
  if ('error' in q) return res.status(400).json({ message: q.error });
  const { customerName, customerPhone, note } = req.body ?? {};
  const errors: Record<string, string> = {};
  const name = typeof customerName === 'string' ? customerName.trim() : '';
  if (name.length < 2 || name.length > 60) errors.customerName = 'Vui lòng nhập tên của bạn';
  const phone = normalizePhone(customerPhone);
  if (!phone) errors.customerPhone = 'Số điện thoại không hợp lệ';
  const cleanNote = typeof note === 'string' ? note.trim().slice(0, 500) : '';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Vui lòng nhập thông tin để tiếp tục thanh toán', errors });

  const code = `AB${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  try {
    const id = transaction(() => {
      const info = db.prepare(`INSERT INTO bookings (code, venue_slug, date, lines_json, total_minutes, total_price, customer_name, customer_phone, note, status, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?)`)
        .run(code, q.venue.slug, q.date, JSON.stringify(q.lines), q.totalMinutes, q.totalPrice, name, phone, cleanNote, req.user?.id ?? null);
      const bookingId = Number(info.lastInsertRowid);
      const ins = db.prepare('INSERT INTO booking_slots (booking_id, venue_slug, date, court, slot) VALUES (?, ?, ?, ?, ?)');
      for (const s of q.slots) ins.run(bookingId, q.venue.slug, q.date, s.court, s.slot);
      return bookingId;
    });
    const row = db.prepare(`${SELECT} WHERE b.id = ?`).get(id) as unknown as BookingRow;
    res.status(201).json({ booking: toBooking(row) });
  } catch (err) {
    if (String(err).includes('UNIQUE')) return res.status(409).json({ message: 'Khung giờ bạn chọn vừa có người đặt, vui lòng chọn lại' });
    throw err;
  }
});

bookingsRouter.get('/mine', requireAuth, (req: AuthedRequest, res) => {
  const rows = db.prepare(`${SELECT} WHERE b.user_id = ? OR b.customer_phone = ? ORDER BY b.date DESC, b.id DESC`).all(req.user!.id, req.user!.phone) as unknown as BookingRow[];
  res.json({ bookings: rows.map(toBooking) });
});

/** Lookup by code requires the phone used on the booking, so codes alone do not leak customer data. */
bookingsRouter.get('/:code', (req: AuthedRequest, res) => {
  const row = db.prepare(`${SELECT} WHERE b.code = ?`).get(String(req.params.code)) as BookingRow | undefined;
  if (!row) return res.status(404).json({ message: 'Không tìm thấy lịch đặt' });
  if (!isOwner(row, req, req.query.phone)) return res.status(404).json({ message: 'Không tìm thấy lịch đặt' });
  res.json({ booking: toBooking(row) });
});

function loadForAction(req: AuthedRequest): BookingRow | null {
  const row = db.prepare(`${SELECT} WHERE b.code = ?`).get(String(req.params.code)) as BookingRow | undefined;
  return row && isOwner(row, req, req.body?.phone) ? row : null;
}

/** Simulated payment confirmation: the clone has no real payment gateway. */
bookingsRouter.post('/:code/pay', (req: AuthedRequest, res) => {
  const row = loadForAction(req);
  if (!row) return res.status(404).json({ message: 'Không tìm thấy lịch đặt' });
  if (row.status !== 'pending_payment') return res.status(400).json({ message: 'Lịch đặt không ở trạng thái chờ thanh toán' });
  db.prepare("UPDATE bookings SET status = 'paid' WHERE id = ?").run(row.id);
  res.json({ booking: toBooking({ ...row, status: 'paid' }) });
});

bookingsRouter.post('/:code/cancel', (req: AuthedRequest, res) => {
  const row = loadForAction(req);
  if (!row) return res.status(404).json({ message: 'Không tìm thấy lịch đặt' });
  if (row.status === 'cancelled') return res.status(400).json({ message: 'Lịch đặt đã được huỷ' });
  transaction(() => {
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(row.id);
    db.prepare('DELETE FROM booking_slots WHERE booking_id = ?').run(row.id);
  });
  res.json({ booking: toBooking({ ...row, status: 'cancelled' }) });
});
