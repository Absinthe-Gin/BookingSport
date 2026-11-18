// Captures reference screenshots of the source site and downloads image assets it loads.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE = 'https://datlich.alobo.vn/';
const root = path.resolve(import.meta.dirname, '..');
const refDir = path.join(root, 'docs/reference');
const assetDir = path.join(root, 'public/assets');
const manifest = new Map();

function localPathFor(url) {
  const u = new URL(url);
  if (u.host === 'm-files.alobo.vn') {
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'branch') return path.join('images/venues', parts[1], parts.slice(2).join('-'));
    if (parts[0] === 'system') return path.join('icons/system', parts.slice(1).join('-'));
    return path.join('images/banners', parts.join('-'));
  }
  if (u.host === 'datlich.alobo.vn') {
    const name = path.basename(u.pathname);
    if (u.pathname.includes('/icons/') && !u.pathname.includes('/images/')) return path.join('icons', name);
    return path.join('images', name);
  }
  return null;
}

async function attach(page) {
  page.on('response', async (res) => {
    const url = res.url().split('?')[0];
    if (!/\.(png|jpe?g|webp|svg)$/i.test(url) || manifest.has(url)) return;
    const rel = localPathFor(url);
    if (!rel || res.status() !== 200) return;
    try {
      const buf = await res.body();
      const dest = path.join(assetDir, rel);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buf);
      manifest.set(url, rel.replaceAll('\\', '/'));
    } catch {}
  });
}

const browser = await chromium.launch();
const nav = (w, h, name) => ({ x: w * ({ home: 0.111, map: 0.305, explore: 0.5, featured: 0.694, account: 0.889 }[name]), y: h - 40 });

async function onboarding(page, w, h, dir) {
  for (let i = 1; i <= 4; i++) {
    await shot(page, `${dir}/pw-onboarding-${i}.png`);
    await page.mouse.click(w / 2, h - 36);
  }
  await page.waitForTimeout(3000);
}

async function shot(page, file) {
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(refDir, file) });
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'vi-VN', geolocation: { latitude: 21.0244665, longitude: 105.8411667 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  await attach(page);
  await page.goto(SOURCE, { waitUntil: 'networkidle' }); await page.waitForTimeout(15000);
  await onboarding(page, 1440, 900, 'desktop');
  await shot(page, 'desktop/pw-home.png');
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(1200); }
  await shot(page, 'desktop/pw-home-scrolled.png');
  let p = nav(1440, 900, 'featured');
  await page.mouse.click(p.x, p.y);
  await shot(page, 'desktop/pw-featured.png');
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(1500); }
  p = nav(1440, 900, 'explore');
  await page.mouse.click(p.x, p.y);
  await shot(page, 'desktop/pw-explore.png');
  p = nav(1440, 900, 'account');
  await page.mouse.click(p.x, p.y);
  await shot(page, 'desktop/pw-account.png');
  await ctx.close();
}

for (const [w, h, dir] of [[390, 844, 'mobile'], [768, 1024, 'tablet']]) {
  await fs.mkdir(path.join(refDir, dir), { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'vi-VN' });
  const page = await ctx.newPage();
  await attach(page);
  await page.goto(SOURCE, { waitUntil: 'networkidle' }); await page.waitForTimeout(15000);
  await onboarding(page, w, h, dir);
  await shot(page, `${dir}/pw-home.png`);
  let p = nav(w, h, 'featured');
  await page.mouse.click(p.x, p.y);
  await shot(page, `${dir}/pw-featured.png`);
  p = nav(w, h, 'explore');
  await page.mouse.click(p.x, p.y);
  await shot(page, `${dir}/pw-explore.png`);
  p = nav(w, h, 'account');
  await page.mouse.click(p.x, p.y);
  await shot(page, `${dir}/pw-account.png`);
  await ctx.close();
}

await browser.close();
await fs.writeFile(path.join(root, 'docs/asset-manifest.json'), JSON.stringify(Object.fromEntries(manifest), null, 2));
console.log(`assets: ${manifest.size}`);
