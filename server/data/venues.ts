// Venue data observed on datlich.alobo.vn on 2026-11-18.
// Observed: name, address, opening hours, rating, distance from the reference point, images.
// Estimated: coordinates (computed from distance + bearing), court list (except Cổng B Ga), price tables (except Cổng B Ga), phone.
import type { PriceRow, SportId } from '../../shared/types.ts';

export interface VenueSeed {
  slug: string;
  name: string;
  address: string;
  sport: SportId;
  openHour: number;
  closeHour: number;
  rating: number | null;
  distanceM: number;
  bearingDeg: number;
  courts: string[];
  priceTable: PriceRow[];
  priceTitle: string;
  phone: string;
  hasEvents: boolean;
  fullImages: boolean;
  dataSource: 'observed' | 'estimated';
}

const standardPrice = (base: number): PriceRow[] => [
  { fromHour: 0, toHour: 9, fixed: base, walkIn: base + 20000 },
  { fromHour: 9, toHour: 11, fixed: base + 50000, walkIn: base + 70000 },
  { fromHour: 11, toHour: 17, fixed: base + 90000, walkIn: base + 120000 },
  { fromHour: 17, toHour: 24, fixed: base + 180000, walkIn: base + 210000 },
];

const courts = (n: number, prefix = 'Sân') => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);

export const venueSeeds: VenueSeed[] = [
  {
    slug: 'sport_pickleball_cong_b_ga_ha_noi',
    name: 'Pickleball cổng B Ga Hà Nội',
    address: '1 P. Trần Quý Cáp, Văn Chương, Đống Đa, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 24, rating: null, distanceM: 273.5, bearingDeg: 265,
    courts: courts(3),
    priceTable: [
      { fromHour: 5, toHour: 9, fixed: 100000, walkIn: 120000 },
      { fromHour: 9, toHour: 11, fixed: 150000, walkIn: 170000 },
      { fromHour: 11, toHour: 17, fixed: 190000, walkIn: 220000 },
      { fromHour: 17, toHour: 24, fixed: 280000, walkIn: 310000 },
    ],
    priceTitle: 'Pickleball Cổng B Ga Hà Nội',
    phone: '0333 466 886', hasEvents: true, fullImages: true, dataSource: 'observed',
  },
  {
    slug: 'sport_san_pickleball_phuc_long_460_tran_quy_cap',
    name: 'Phúc Long Pickleball 460 Trần Quý Cáp',
    address: 'P. Trần Quý Cáp, Văn Miếu - Quốc Tử Giám, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 24, rating: null, distanceM: 288.4, bearingDeg: 250,
    courts: courts(4), priceTable: standardPrice(110000), priceTitle: 'Phúc Long Pickleball',
    phone: '0912 460 460', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_san_cau_long_phuc_long_460_tran_quy_cap',
    name: 'Sân Cầu Lông Phúc Long - 460 Trần Quý Cáp',
    address: 'P. Trần Quý Cáp, Văn Miếu - Quốc Tử Giám, Hà Nội',
    sport: 'badminton', openHour: 0, closeHour: 24, rating: null, distanceM: 300.3, bearingDeg: 245,
    courts: courts(6), priceTable: standardPrice(60000), priceTitle: 'Sân Cầu Lông Phúc Long',
    phone: '0912 460 461', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_railway_pickleball',
    name: 'RAILWAY Khâm Thiên',
    address: '2D Khâm Thiên, Đống Đa, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: 4.2, distanceM: 333.3, bearingDeg: 190,
    courts: courts(4), priceTable: standardPrice(120000), priceTitle: 'RAILWAY Khâm Thiên',
    phone: '0988 222 333', hasEvents: true, fullImages: true, dataSource: 'estimated',
  },
  {
    slug: 'sport_city_pickleball_nguyen_khuyen',
    name: 'City Pickleball Nguyễn Khuyến',
    address: '11A P. Nguyễn Khuyến, Văn Miếu- Quốc Tử Giám, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 23, rating: null, distanceM: 337.5, bearingDeg: 320,
    courts: courts(3), priceTable: standardPrice(120000), priceTitle: 'City Pickleball Nguyễn Khuyến',
    phone: '0976 111 222', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_pickleball_bao_viet',
    name: 'Bảo Việt Pickleball',
    address: '71 Ngô Sĩ Liên phường Văn Miếu - Quốc Tử Giám, TP Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: null, distanceM: 348.7, bearingDeg: 285,
    courts: courts(2), priceTable: standardPrice(100000), priceTitle: 'Bảo Việt Pickleball',
    phone: '0904 717 171', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_triniti_pickleball',
    name: 'Trinity Pickleball',
    address: 'Số 14 Trần Bình Trọng, Trần Hưng Đạo, Quận Hai Bà Trưng, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: 4.5, distanceM: 508.1, bearingDeg: 115,
    courts: courts(3), priceTable: standardPrice(130000), priceTitle: 'Trinity Pickleball',
    phone: '0868 141 414', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_thap_ha_noi_pickleball_club',
    name: 'HANOI TOWER - 49 HAI BÀ TRƯNG - HOÀN KIẾM',
    address: 'Tháp Hà Nội - 49 Hai Bà Trưng - Hoàn Kiếm - Hà Nội',
    sport: 'pickleball', openHour: 7, closeHour: 22, rating: 5, distanceM: 559.0, bearingDeg: 55,
    courts: courts(2), priceTable: standardPrice(150000), priceTitle: 'Hanoi Tower Pickleball',
    phone: '0243 934 4949', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_3ce',
    name: '3CE',
    address: '85 Tôn Đức Thắng - phường Văn Miếu - Quốc Tử Giám - Hà Nội',
    sport: 'pickleball', openHour: 6, closeHour: 22, rating: null, distanceM: 837.5, bearingDeg: 290,
    courts: courts(3), priceTable: standardPrice(110000), priceTitle: '3CE Pickleball',
    phone: '0936 858 585', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_pickle_pit_ton_duc_thang',
    name: 'Pickle Pit Tôn Đức Thắng',
    address: '160 P.Tôn Đức Thắng( số 1 Phan Văn Trị), Hàng Bột, Đống Đa, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 23, rating: 4.8, distanceM: 950.2, bearingDeg: 262,
    courts: courts(4), priceTable: standardPrice(120000), priceTitle: 'Pickle Pit',
    phone: '0901 160 160', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_city_pickleball_kham_thien',
    name: 'City Pickleball Khâm Thiên',
    address: '2D Khâm Thiên, Văn Miếu- Quốc Tử Giám, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: 5, distanceM: 954.1, bearingDeg: 200,
    courts: courts(3), priceTable: standardPrice(120000), priceTitle: 'City Pickleball Khâm Thiên',
    phone: '0976 111 333', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_thinh_hao_pickleball',
    name: 'Thịnh Hào Pickleball',
    address: 'Số 60, ngõ Thịnh Hào 1 (trong công ty Artex Thăng Long), Đống Đa, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: 4.6, distanceM: 1100, bearingDeg: 230,
    courts: courts(5), priceTable: standardPrice(90000), priceTitle: 'Thịnh Hào Pickleball',
    phone: '0912 606 060', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_cat_linh_pickleball_club',
    name: 'Cát Linh Pickleball( Sân Trong Nhà)',
    address: '31 Cát Linh, Phường Ô Chợ Dừa, Hà Nội',
    sport: 'pickleball', openHour: 5, closeHour: 22, rating: null, distanceM: 1300, bearingDeg: 300,
    courts: courts(4), priceTable: standardPrice(130000), priceTitle: 'Cát Linh Pickleball',
    phone: '0989 313 131', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_ace_pickleball_club_pullman_hanoi',
    name: 'ACE Pickleball Club - Pullman HaNoi',
    address: '40 Cát Linh - 61 Giảng Võ ,P. Ô Chợ Dừa ,TP. Hà Nội',
    sport: 'pickleball', openHour: 6, closeHour: 22, rating: 5, distanceM: 1400, bearingDeg: 305,
    courts: courts(3), priceTable: standardPrice(160000), priceTitle: 'ACE Pickleball Club',
    phone: '0243 733 0688', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
  {
    slug: 'sport_nha_the_thao_binh_chung_thong_tin',
    name: 'Nhà Thể Thao - Binh Chủng Thông Tin',
    address: '01 Giang Văn Minh - Giảng Võ - Hà Nội',
    sport: 'multi', openHour: 5, closeHour: 22, rating: null, distanceM: 1600, bearingDeg: 315,
    courts: courts(4), priceTable: standardPrice(80000), priceTitle: 'Nhà Thể Thao Binh Chủng Thông Tin',
    phone: '0243 845 0101', hasEvents: true, fullImages: false, dataSource: 'estimated',
  },
];
