// End-to-end checks against the running dev servers (npm run dev).
// Usage: node scripts/e2e.mjs [suite...]   Suites: booking, auth, search, social, nav, responsive
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:5180';
const OUT = path.resolve(import.meta.dirname, '../docs/reference/compare');
await fs.mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const VENUE = 'sport_pickleball_cong_b_ga_ha_noi';
const uniquePhone = () => `09${String(Date.now()).slice(-8)}`;

const browser = await chromium.launch();
const results = [];

async function newPage(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport, locale: 'vi-VN' });
  await ctx.addInitScript(() => localStorage.setItem('ab_onboarded', '1'));
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.errors.push(m.text()); });
  return page;
}

async function run(name, fn) {
  if (only.length && !only.includes(name)) return;
  const page = await newPage();
  try {
    await fn(page);
    assert.deepEqual(page.errors, [], `runtime errors: ${page.errors.join(' | ')}`);
    results.push([name, 'PASS']);
  } catch (e) {
    await page.screenshot({ path: path.join(OUT, `FAIL-${name}.png`) }).catch(() => {});
    results.push([name, `FAIL: ${e.message.split('\n')[0]}`]);
  } finally {
    await page.context().close();
  }
}

const shot = (page, name) => page.screenshot({ path: path.join(OUT, `${name}.png`) });

async function pickFreeSlots(page, n) {
  // Look a few days ahead so there are always free slots regardless of the time of day.
  await page.getByRole('option').nth(2).click();
  await page.waitForSelector('[role="gridcell"]:not([disabled])');
  const cells = page.locator('[role="gridcell"]:not([disabled])');
  for (let i = 0; i < n; i++) await cells.nth(i).click();
}

await run('booking', async (page) => {
  await page.goto(`${BASE}/`);
  await page.getByRole('button', { name: 'ĐẶT LỊCH' }).first().click();
  await page.getByText('Chọn hình thức đặt').waitFor();
  await shot(page, 'local-booking-type-modal');
  await page.getByRole('button', { name: /Đặt lịch theo sân - trực quan/i }).click();
  await page.waitForURL(/userBooking\//);
  await page.locator('[role="grid"]').waitFor();
  await shot(page, 'local-booking-grid');
  await pickFreeSlots(page, 2);
  await page.getByText(/Tổng tiền:/).waitFor();
  await shot(page, 'local-booking-selected');
  await page.getByRole('button', { name: 'TIẾP THEO' }).click();
  await page.waitForURL(/confirm$/);
  await page.getByText('Thông tin lịch đặt').waitFor();
  await page.getByRole('button', { name: /XÁC NHẬN/ }).click();
  await page.getByText('Vui lòng nhập tên của bạn').first().waitFor();
  await shot(page, 'local-booking-confirm-errors');
  await page.getByPlaceholder('Nhập tên của bạn').fill('Khách Test');
  await page.getByPlaceholder('Nhập số điện thoại').fill(uniquePhone());
  await page.getByRole('button', { name: /XÁC NHẬN/ }).click();
  await page.waitForURL(/\/booking\//);
  await page.getByText('Chờ thanh toán').waitFor();
  await shot(page, 'local-booking-payment');
  await page.getByRole('button', { name: 'Tôi đã chuyển khoản' }).click();
  await page.getByText('Đặt lịch thành công!').waitFor();
  await shot(page, 'local-booking-success');
});

await run('booking-conflict', async (page) => {
  const date = (await (await fetch(`${BASE}/api/venues/${VENUE}/availability`)).json()).today;
  const avail = (await (await fetch(`${BASE}/api/venues/${VENUE}/availability?date=${date}`)).json()).availability;
  const free = avail.cells[0].findIndex((c) => c === 'free');
  assert.ok(free >= 0, 'expected a free slot');
  const body = { venueSlug: VENUE, date, slots: [{ court: 0, slot: free }], customerName: 'Race One', customerPhone: uniquePhone() };
  const [a, b] = await Promise.all([1, 2].map(() => fetch(`${BASE}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })));
  const statuses = [a.status, b.status];
  assert.equal(statuses.filter((s) => s === 201).length, 1, `exactly one booking should win, got ${statuses}`);
  assert.ok(statuses.some((s) => s === 400 || s === 409), `the other request should be rejected, got ${statuses}`);
  void page;
});

await run('auth', async (page) => {
  await page.goto(`${BASE}/account`);
  await page.getByText('Tạo tài khoản để dễ dàng quản lý').waitFor();
  await shot(page, 'local-account-guest-dialog');
  await page.getByRole('button', { name: 'OK' }).click();

  await page.goto(`${BASE}/`);
  await page.getByRole('button', { name: 'Yêu thích', exact: true }).click();
  await page.getByText('Chưa có sân yêu thích').waitFor();

  await page.goto(`${BASE}/uRegister`);
  await page.getByRole('button', { name: 'ĐĂNG KÝ' }).click();
  await page.getByText('Vui lòng nhập họ và tên').waitFor();
  const phone = uniquePhone();
  await page.getByPlaceholder('Nhập số điện thoại').fill(phone);
  await page.getByPlaceholder('Nhập họ và tên').fill('Người Dùng Test');
  await page.getByPlaceholder('Nhập mật khẩu (*)').fill('matkhau1');
  await page.getByPlaceholder('Nhập lại mật khẩu').fill('matkhau1');
  await shot(page, 'local-register');
  await page.getByRole('button', { name: 'ĐĂNG KÝ' }).click();
  await page.getByText('Xin chào, Người Dùng Test').first().waitFor();

  await page.getByRole('button', { name: /^Yêu thích Pickleball cổng B Ga/ }).click();
  await page.getByRole('button', { name: 'Yêu thích', exact: true }).click();
  await page.waitForURL(/favorites/);
  await page.getByText('Pickleball cổng B Ga Hà Nội').waitFor();

  await page.goto(`${BASE}/userBooking/${VENUE}`);
  await pickFreeSlots(page, 1);
  await page.getByRole('button', { name: 'TIẾP THEO' }).click();
  await page.waitForURL(/confirm$/);
  assert.equal(await page.getByPlaceholder('Nhập tên của bạn').inputValue(), 'Người Dùng Test');
  await page.getByRole('button', { name: /XÁC NHẬN/ }).click();
  await page.waitForURL(/\/booking\//);

  await page.goto(`${BASE}/account`);
  await page.getByText('Pickleball cổng B Ga Hà Nội').first().waitFor();
  await shot(page, 'local-account-bookings');
  await page.getByRole('button', { name: 'Huỷ lịch' }).first().click();
  await page.getByRole('button', { name: 'Đồng ý' }).click();
  await page.getByText('Đã huỷ lịch đặt').waitFor();

  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Đăng xuất' }).click();
  await page.goto(`${BASE}/uLogin`);
  await page.getByPlaceholder('Nhập số điện thoại').fill(phone);
  await page.getByPlaceholder('Nhập mật khẩu (*)').fill('sai-mat-khau');
  await page.getByRole('button', { name: 'ĐĂNG NHẬP', exact: true }).click();
  await page.getByText('Tài khoản hoặc mật khẩu không đúng').waitFor();
  await page.getByPlaceholder('Nhập mật khẩu (*)').fill('matkhau1');
  await shot(page, 'local-login');
  await page.getByRole('button', { name: 'ĐĂNG NHẬP', exact: true }).click();
  await page.waitForURL(`${BASE}/`);
  await page.getByText('Xin chào, Người Dùng Test').first().waitFor();
});

console.table(results);
await browser.close();
process.exit(results.some((r) => r[1] !== 'PASS') ? 1 : 0);
