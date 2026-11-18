import type { SportId } from '@shared/types';

export type BookingKind = 'free' | 'event' | 'team';
export type AreaMode = 'area' | 'distance';

export interface SearchFilters {
  sports: SportId[];
  kind: BookingKind;
  areaMode: AreaMode;
  province: string;
  ward: string;
  favoritesOnly: boolean;
  maxKm: number | null;
}

export const defaultFilters: SearchFilters = {
  sports: [], kind: 'free', areaMode: 'area', province: '', ward: '', favoritesOnly: false, maxKm: null,
};

export const PROVINCES: { name: string; match: string; wards: string[] }[] = [
  { name: 'Hà Nội', match: 'Hà Nội', wards: ['Đống Đa', 'Văn Miếu - Quốc Tử Giám', 'Văn Chương', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Ô Chợ Dừa', 'Giảng Võ', 'Hàng Bột', 'Trần Hưng Đạo'] },
  { name: 'TP Hồ Chí Minh', match: 'Hồ Chí Minh', wards: ['Quận 2', 'Quận 3', 'Quận 7', 'Tân Hưng', 'Xuân Hòa'] },
];

export const DISTANCES = [1, 3, 5, 10];

function strip(s: string) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase().replace(/[\s-]+/g, ' ');
}

/** Address match that ignores accents and the "Văn Miếu- Quốc Tử Giám" spacing variants seen in the source data. */
export function addressMatches(address: string, term: string) {
  return strip(address).includes(strip(term));
}

export function countActive(f: SearchFilters) {
  return f.sports.length + (f.kind !== 'free' ? 1 : 0) + (f.province ? 1 : 0) + (f.ward ? 1 : 0) + (f.favoritesOnly ? 1 : 0) + (f.maxKm ? 1 : 0);
}
