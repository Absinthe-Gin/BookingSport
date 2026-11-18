import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(import.meta.dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const dbPath = process.env.DB_PATH ?? path.join(dataDir, 'booking.db');
export const db = new DatabaseSync(dbPath);

db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  sport TEXT NOT NULL,
  open_hour INTEGER NOT NULL,
  close_hour INTEGER NOT NULL,
  rating REAL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  phone TEXT NOT NULL,
  courts_json TEXT NOT NULL,
  price_json TEXT NOT NULL,
  price_title TEXT NOT NULL,
  gallery_json TEXT NOT NULL,
  full_images INTEGER NOT NULL,
  has_events INTEGER NOT NULL,
  data_source TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  venue_slug TEXT NOT NULL REFERENCES venues(slug),
  date TEXT NOT NULL,
  lines_json TEXT NOT NULL,
  total_minutes INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS booking_slots (
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  venue_slug TEXT NOT NULL,
  date TEXT NOT NULL,
  court INTEGER NOT NULL,
  slot INTEGER NOT NULL,
  UNIQUE (venue_slug, date, court, slot)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_slug TEXT NOT NULL REFERENCES venues(slug),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, venue_slug)
);

CREATE TABLE IF NOT EXISTS social_venues (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  sport TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS social_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venue_slug TEXT NOT NULL REFERENCES social_venues(slug),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  court TEXT NOT NULL,
  taken INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  sport TEXT NOT NULL,
  simulated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_social_date ON social_sessions(date);

CREATE TABLE IF NOT EXISTS social_joins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES social_sessions(id),
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS feed_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  posted_at TEXT NOT NULL,
  json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  cta TEXT NOT NULL,
  link TEXT NOT NULL
);
`);

export function transaction<T>(fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
