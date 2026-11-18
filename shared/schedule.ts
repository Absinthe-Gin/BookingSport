import type { PriceRow } from './types.ts';

export const SLOT_MINUTES = 30;

export function slotToTime(startHour: number, slot: number): string {
  const total = startHour * 60 + slot * SLOT_MINUTES;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function slotCount(openHour: number, closeHour: number): number {
  return ((closeHour - openHour) * 60) / SLOT_MINUTES;
}

/** Walk-in price for one 30-minute slot. */
export function slotPrice(table: PriceRow[], startHour: number, slot: number): number {
  const hour = startHour + (slot * SLOT_MINUTES) / 60;
  const row = table.find((r) => hour >= r.fromHour && hour < r.toHour) ?? table[table.length - 1];
  return row ? Math.round(row.walkIn / (60 / SLOT_MINUTES)) : 0;
}

export function formatMinutes(min: number): string {
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
}

/** Groups consecutive slots on the same court into ranges. */
export function groupSlots(slots: { court: number; slot: number }[]): { court: number; startSlot: number; endSlot: number }[] {
  const sorted = [...slots].sort((a, b) => a.court - b.court || a.slot - b.slot);
  const out: { court: number; startSlot: number; endSlot: number }[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && last.court === s.court && last.endSlot === s.slot) last.endSlot = s.slot + 1;
    else out.push({ court: s.court, startSlot: s.slot, endSlot: s.slot + 1 });
  }
  return out;
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function formatDistance(km: number): string {
  return km < 1 ? `${(km * 1000).toFixed(1)}m` : `${km.toFixed(1)}km`;
}

export function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}

/** Default reference point used by the source site (Hà Nội railway station). */
export const DEFAULT_LOCATION = { lat: 21.0244665, lng: 105.8411667 };
