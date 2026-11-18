import type { SportId } from '@shared/types';

export const SPORTS: { id: SportId; label: string; color: string }[] = [
  { id: 'pickleball', label: 'Pickleball', color: '#4a90e2' },
  { id: 'badminton', label: 'Cầu lông', color: '#1db45a' },
  { id: 'football', label: 'Bóng đá', color: '#2e8b3d' },
  { id: 'basketball', label: 'Bóng rổ', color: '#f5a623' },
  { id: 'tennis', label: 'Quần vợt', color: '#e67e22' },
  { id: 'multi', label: 'Đa năng', color: '#d0021b' },
  { id: 'typti', label: 'Typti', color: '#6b8bd6' },
  { id: 'surfing', label: 'Lướt ván', color: '#e8a04a' },
  { id: 'swimming', label: 'Bơi lội', color: '#2d9cdb' },
  { id: 'volleyball', label: 'B.Chuyền', color: '#e5c100' },
  { id: 'golf', label: 'Golf', color: '#7b9a1e' },
  { id: 'padel', label: 'Padel', color: '#2bb3c0' },
];

export const sportLabel = (id: SportId) => SPORTS.find((s) => s.id === id)?.label ?? id;
export const sportColor = (id: SportId) => SPORTS.find((s) => s.id === id)?.color ?? '#006d38';
