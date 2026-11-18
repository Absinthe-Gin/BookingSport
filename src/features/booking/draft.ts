import type { SelectedSlot } from '@shared/types';

export interface BookingDraft {
  venueSlug: string;
  date: string;
  slots: SelectedSlot[];
}

const key = (slug: string) => `ab_draft_${slug}`;

export function saveDraft(d: BookingDraft) {
  try { sessionStorage.setItem(key(d.venueSlug), JSON.stringify(d)); } catch { /* storage unavailable */ }
}

export function loadDraft(slug: string): BookingDraft | null {
  try {
    const raw = sessionStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraft(slug: string) {
  try { sessionStorage.removeItem(key(slug)); } catch { /* storage unavailable */ }
}

/** Remembers which phone a guest used, so the payment page can load the booking. */
export function rememberBookingPhone(code: string, phone: string) {
  try { sessionStorage.setItem(`ab_booking_${code}`, phone); } catch { /* storage unavailable */ }
}
export function bookingPhone(code: string): string | undefined {
  try { return sessionStorage.getItem(`ab_booking_${code}`) ?? undefined; } catch { return undefined; }
}
