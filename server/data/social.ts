// Social sessions ("Xé vé"). Today's schedule for the 4 outside venues was observed on 2026-11-18.
// Session details beyond the first ticket of each venue, and every other day, are simulated with a fixed seed.
import type { SportId } from '../../shared/types.ts';

export interface SocialVenueSeed {
  slug: string;
  name: string;
  logo: string | null;
  distanceM: number;
  bearingDeg: number;
  sport: SportId;
  /** Observed start times today with the number of sessions or spots shown on the chip. */
  todayTimes: { time: string; sessions: number; durationH: number }[];
  observedTicket: { title: string; court: string; taken: number; capacity: number; price: number; level: string };
}

export const socialVenueSeeds: SocialVenueSeed[] = [
  {
    slug: 'social_maxping_488_minh_khai',
    name: 'Maxping Pickleball 488 Minh Khai ( cổng Times City Sân Điều Hoà )',
    logo: null, distanceM: 4200, bearingDeg: 140, sport: 'pickleball',
    todayTimes: [
      { time: '11:00', sessions: 1, durationH: 2 }, { time: '12:00', sessions: 1, durationH: 1 },
      { time: '14:00', sessions: 1, durationH: 2 }, { time: '16:00', sessions: 1, durationH: 2 },
      { time: '20:30', sessions: 1, durationH: 2 },
    ],
    observedTicket: { title: 'Trình 1 năm', court: 'Sân 4', taken: 0, capacity: 8, price: 60000, level: '2.5 → 3.0' },
  },
  {
    slug: 'social_clb_huynh_thuc_khang',
    name: 'CLB Pickleball Huỳnh Thúc Kháng',
    logo: null, distanceM: 3900, bearingDeg: 280, sport: 'pickleball',
    todayTimes: [
      { time: '12:00', sessions: 5, durationH: 3 }, { time: '15:00', sessions: 9, durationH: 2 },
      { time: '16:00', sessions: 2, durationH: 2 }, { time: '18:00', sessions: 6, durationH: 2 },
      { time: '20:00', sessions: 5, durationH: 2 }, { time: '21:00', sessions: 3, durationH: 2 },
      { time: '22:00', sessions: 6, durationH: 1 },
    ],
    observedTicket: { title: 'Trên 6 tháng', court: 'Sân 10', taken: 7, capacity: 8, price: 100000, level: '2.0 → 2.5' },
  },
  {
    slug: 'social_dai_kim_complex',
    name: 'Dai Kim Pickleball Complex',
    logo: null, distanceM: 5900, bearingDeg: 185, sport: 'pickleball',
    todayTimes: [
      { time: '09:00', sessions: 3, durationH: 2 }, { time: '13:30', sessions: 2, durationH: 2 },
      { time: '14:00', sessions: 2, durationH: 2 }, { time: '20:00', sessions: 2, durationH: 2 },
    ],
    observedTicket: { title: 'Trình Khá ( Giao lưu 2 sân )', court: 'Sân 5 - 6', taken: 9, capacity: 16, price: 80000, level: '3.0 → 3.5' },
  },
  {
    slug: 'social_dici_sport',
    name: 'Dici Sport',
    logo: null, distanceM: 9300, bearingDeg: 230, sport: 'pickleball',
    todayTimes: [
      { time: '12:00', sessions: 1, durationH: 2 }, { time: '15:00', sessions: 1, durationH: 2 },
      { time: '18:00', sessions: 1, durationH: 2 }, { time: '19:30', sessions: 1, durationH: 2 },
    ],
    observedTicket: { title: '6-9 tháng', court: 'Pickleball 3', taken: 0, capacity: 8, price: 70000, level: '1.5 → 2.0' },
  },
];

export const levelPool = [
  { title: 'Trình 1 năm', level: '2.5 → 3.0' },
  { title: 'Trên 6 tháng', level: '2.0 → 2.5' },
  { title: '6/9 Tháng', level: '1.5 → 2.0' },
  { title: '9/12 Tháng', level: '2.0 → 2.5' },
  { title: 'Trên 1 Năm', level: '2.5 → 3.0' },
  { title: 'Pro Căng Tay', level: '3.0 → 3.5' },
  { title: 'Newbie giao lưu', level: '1.0 → 1.5' },
];
