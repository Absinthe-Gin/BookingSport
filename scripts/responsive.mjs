// Screenshots every main route at phone, tablet and desktop widths and reports horizontal overflow.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:5180';
const OUT = path.resolve(import.meta.dirname, '../docs/reference/compare/responsive');
await fs.mkdir(OUT, { recursive: true });
const VENUE = 'sport_pickleball_cong_b_ga_ha_noi';
const routes = ['/', `/san/${VENUE}`, '/search?filters=1', '/map', '/explore', '/explore?tab=event', '/explore?tab=membership', '/featured', '/account', '/uLogin', '/uRegister', `/userBooking/${VENUE}`, `/userBooking/${VENUE}/prices`, '/socialNearby'];
const sizes = [[390, 844, 'mobile'], [768, 1024, 'tablet'], [1440, 900, 'desktop']];

const browser = await chromium.launch();
const problems = [];
for (const [w, h, name] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, locale: 'vi-VN', isMobile: w < 1024, hasTouch: w < 1024 });
  await ctx.addInitScript(() => localStorage.setItem('ab_onboarded', '1'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= window.innerWidth + 1) return null;
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed'; })
        .filter((el) => !el.closest('.overflow-x-auto, .overflow-auto, .overflow-hidden, .leaflet-container'))
        .slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      return { scrollWidth: doc.scrollWidth, offenders };
    });
    if (overflow) problems.push({ size: name, route: r, ...overflow });
    await page.screenshot({ path: path.join(OUT, `${name}${r.replace(/[/?=]/g, '_') || '_home'}.png`) });
  }
  if (errors.length) problems.push({ size: name, errors });
  await ctx.close();
}
await browser.close();
console.log(problems.length ? JSON.stringify(problems, null, 2) : 'No overflow or runtime errors');
