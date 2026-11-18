import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { findUser, normalizePhone, requireAuth, signToken, type AuthedRequest } from '../lib/auth.ts';

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

authRouter.post('/register', (req, res) => {
  const { phone, email, fullName, password, confirmPassword } = req.body ?? {};
  const errors: Record<string, string> = {};
  const normPhone = normalizePhone(phone);
  if (!normPhone) errors.phone = 'Số điện thoại không hợp lệ';
  const mail = typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null;
  if (mail && !EMAIL_RE.test(mail)) errors.email = 'Email không hợp lệ';
  const name = typeof fullName === 'string' ? fullName.trim() : '';
  if (name.length < 2 || name.length > 60) errors.fullName = 'Vui lòng nhập họ và tên';
  if (typeof password !== 'string' || password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';
  else if (password !== confirmPassword) errors.confirmPassword = 'Mật khẩu nhập lại không khớp';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Thông tin không hợp lệ', errors });

  if (db.prepare('SELECT 1 FROM users WHERE phone = ?').get(normPhone)) {
    return res.status(409).json({ message: 'Số điện thoại đã được đăng ký', errors: { phone: 'Số điện thoại đã được đăng ký' } });
  }
  if (mail && db.prepare('SELECT 1 FROM users WHERE email = ?').get(mail)) {
    return res.status(409).json({ message: 'Email đã được đăng ký', errors: { email: 'Email đã được đăng ký' } });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (full_name, phone, email, password_hash) VALUES (?, ?, ?, ?)').run(name, normPhone, mail, hash);
  const id = Number(info.lastInsertRowid);
  res.status(201).json({ token: signToken(id), user: findUser(id) });
});

authRouter.post('/login', (req, res) => {
  const { phone, email, password } = req.body ?? {};
  let row: { id: number; password_hash: string } | undefined;
  if (email) {
    row = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(String(email).trim().toLowerCase()) as typeof row;
  } else {
    const normPhone = normalizePhone(phone);
    if (!normPhone) return res.status(400).json({ message: 'Số điện thoại không hợp lệ', errors: { phone: 'Số điện thoại không hợp lệ' } });
    row = db.prepare('SELECT id, password_hash FROM users WHERE phone = ?').get(normPhone) as typeof row;
  }
  if (typeof password !== 'string' || !password) return res.status(400).json({ message: 'Vui lòng nhập mật khẩu', errors: { password: 'Vui lòng nhập mật khẩu' } });
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
  }
  res.json({ token: signToken(row.id), user: findUser(row.id) });
});

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});
