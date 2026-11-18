import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db.ts';
import type { User } from '../../shared/types.ts';

const DEV_SECRET = 'dev-only-secret-change-me';
const SECRET = process.env.JWT_SECRET ?? DEV_SECRET;
if (SECRET === DEV_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

export interface AuthedRequest extends Request {
  user?: User;
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, SECRET, { expiresIn: '30d' });
}

export function findUser(id: number): User | null {
  const row = db.prepare('SELECT id, full_name, phone, email FROM users WHERE id = ?').get(id) as
    | { id: number; full_name: string; phone: string; email: string | null } | undefined;
  return row ? { id: row.id, fullName: row.full_name, phone: row.phone, email: row.email } : null;
}

/** Attaches req.user when a valid bearer token is present; never rejects. */
export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), SECRET) as { sub: string };
      req.user = findUser(Number(payload.sub)) ?? undefined;
    } catch {
      // invalid token: treat as guest
    }
  }
  next();
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: 'Vui lòng đăng nhập' });
  next();
}

export function normalizePhone(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  let p = input.replace(/[\s.-]/g, '');
  if (p.startsWith('+84')) p = '0' + p.slice(3);
  else if (p.startsWith('84') && p.length === 11) p = '0' + p.slice(2);
  else if (!p.startsWith('0')) p = '0' + p;
  return /^0\d{9}$/.test(p) ? p : null;
}
