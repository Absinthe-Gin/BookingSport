import type { Venue } from '@shared/types';

const pad = (n: number) => String(n).padStart(2, '0');

export function hoursLabel(v: Pick<Venue, 'openHour' | 'closeHour'>): string {
  return `${pad(v.openHour)}:00 - ${pad(v.closeHour)}:00`;
}

export function directionsUrl(v: Pick<Venue, 'lat' | 'lng'>): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}`;
}

export function bookingLink(slug: string): string {
  return `${window.location.origin}/san/${slug}`;
}
