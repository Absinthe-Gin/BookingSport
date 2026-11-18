// Usage: node scripts/shot.mjs <path> <out.png> [width] [height] [--full] [--onboard]
import { chromium } from 'playwright';
const [, , route = '/', out = 'shot.png', w = '1440', h = '900', ...flags] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, locale: 'vi-VN' });
if (!flags.includes('--onboard')) await ctx.addInitScript(() => localStorage.setItem('ab_onboarded', '1'));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(`http://localhost:5180${route}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: flags.includes('--full') });
if (errors.length) console.log('ERRORS:', errors.join('\n'));
await browser.close();
