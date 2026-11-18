// Downloads venue cover/avatar images (thumb + full where known) and sport marker from the source CDN.
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const venues = {
  sport_pickleball_cong_b_ga_ha_noi: ['cover-1754454365324-thumb.jpg', 'avatar-1754454365321-thumb.jpg', 'cover-1754454369720.jpg', 'avatar-1754454367762.jpg'],
  sport_railway_pickleball: ['cover-1794555352762-thumb.jpg', 'avatar-1794645331077-thumb.jpg', 'cover-1794555354104.jpg', 'avatar-1794645332339.jpg'],
  sport_triniti_pickleball: ['cover-1753289548262-thumb.jpg', 'avatar-1753289548261-thumb.jpg'],
  sport_pickle_pit_ton_duc_thang: ['cover-1761557178022-thumb.jpg', 'avatar-1753294968484-thumb.jpg'],
  sport_cat_linh_pickleball_club: ['cover-1777773940664-thumb.jpg', 'avatar-1775454475586-thumb.jpg'],
  sport_san_pickleball_phuc_long_460_tran_quy_cap: ['cover-1785855354348-thumb.jpg', 'avatar-1785855299979-thumb.jpg'],
  sport_city_pickleball_nguyen_khuyen: ['cover-1753293892859-thumb.jpg', 'avatar-1753293892858-thumb.jpg'],
  sport_thap_ha_noi_pickleball_club: ['cover-1753374380518-thumb.jpg', 'avatar-1753374380517-thumb.jpg'],
  sport_city_pickleball_kham_thien: ['cover-1753286336961-thumb.jpg', 'avatar-1753286336960-thumb.jpg'],
  sport_ace_pickleball_club_pullman_hanoi: ['cover-1753285779342-thumb.jpg', 'avatar-1753285779342-thumb.jpg'],
  sport_san_cau_long_phuc_long_460_tran_quy_cap: ['cover-1786028152543-thumb.jpg', 'avatar-1784100688841-thumb.jpg'],
  sport_pickleball_bao_viet: ['cover-1791650163519-thumb.jpg', 'avatar-1791650163509-thumb.jpg'],
  sport_3ce: ['cover-1755750010031-thumb.jpg', 'avatar-1755750010026-thumb.jpg'],
  sport_thinh_hao_pickleball: ['cover-1753295984162-thumb.jpg', 'avatar-1753295984148-thumb.jpg'],
  sport_nha_the_thao_binh_chung_thong_tin: ['cover-1780902918995-thumb.jpg', 'avatar-1780902918979-thumb.jpg'],
};

async function get(url, dest) {
  const res = await fetch(url);
  if (!res.ok) return console.warn('skip', res.status, url);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

for (const [slug, files] of Object.entries(venues)) {
  for (const f of files) {
    const kind = f.startsWith('cover') ? 'cover' : 'avatar';
    const name = f.includes('thumb') ? `${kind}-thumb.jpg` : `${kind}.jpg`;
    await get(`https://m-files.alobo.vn/branch/${slug}/main/${f}`, path.join(root, 'public/assets/images/venues', slug, name));
  }
}
await get('https://m-files.alobo.vn/system/sports/marker_pickleball.png', path.join(root, 'public/assets/icons/marker_pickleball.png'));
console.log('done');
