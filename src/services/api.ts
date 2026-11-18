import type { Availability, Banner, Booking, BookingLine, FeedKind, FeedPost, SocialSession, SocialVenue, User, Venue } from '@shared/types';

const TOKEN_KEY = 'ab_token';

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable: session stays in memory only
  }
}

export class ApiError extends Error {
  status: number;
  errors: Record<string, string>;
  constructor(status: number, message: string, errors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.json !== undefined) headers['Content-Type'] = 'application/json';
  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...init, headers, body: init.json !== undefined ? JSON.stringify(init.json) : init.body });
  } catch {
    throw new ApiError(0, 'Không có kết nối internet');
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? 'Có lỗi xảy ra, vui lòng thử lại', data.errors);
  return data as T;
}

export type VenueWithDistance = Venue & { distanceKm: number };

export interface VenueQuery {
  q?: string;
  sports?: string[];
  lat?: number;
  lng?: number;
  maxKm?: number;
  slugs?: string[];
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') s.set(k, String(v));
  const str = s.toString();
  return str ? `?${str}` : '';
}

export const api = {
  venues: (q: VenueQuery = {}) =>
    request<{ venues: VenueWithDistance[] }>(`/venues${qs({ q: q.q, sports: q.sports?.join(','), lat: q.lat, lng: q.lng, maxKm: q.maxKm, slugs: q.slugs?.join(',') })}`).then((r) => r.venues),
  venue: (slug: string) => request<{ venue: Venue }>(`/venues/${encodeURIComponent(slug)}`).then((r) => r.venue),
  availability: (slug: string, date?: string) =>
    request<{ availability: Availability; today: string }>(`/venues/${encodeURIComponent(slug)}/availability${qs({ date })}`),

  quote: (venueSlug: string, date: string, slots: { court: number; slot: number }[]) =>
    request<{ lines: BookingLine[]; totalMinutes: number; totalPrice: number }>('/bookings/quote', { method: 'POST', json: { venueSlug, date, slots } }),
  createBooking: (body: { venueSlug: string; date: string; slots: { court: number; slot: number }[]; customerName: string; customerPhone: string; note: string }) =>
    request<{ booking: Booking }>('/bookings', { method: 'POST', json: body }).then((r) => r.booking),
  booking: (code: string, phone?: string) => request<{ booking: Booking }>(`/bookings/${encodeURIComponent(code)}${qs({ phone })}`).then((r) => r.booking),
  payBooking: (code: string, phone?: string) => request<{ booking: Booking }>(`/bookings/${encodeURIComponent(code)}/pay`, { method: 'POST', json: { phone } }).then((r) => r.booking),
  cancelBooking: (code: string, phone?: string) => request<{ booking: Booking }>(`/bookings/${encodeURIComponent(code)}/cancel`, { method: 'POST', json: { phone } }).then((r) => r.booking),
  myBookings: () => request<{ bookings: Booking[] }>('/bookings/mine').then((r) => r.bookings),

  register: (body: { phone: string; email: string; fullName: string; password: string; confirmPassword: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', json: body }),
  login: (body: { phone?: string; email?: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', json: body }),
  me: () => request<{ user: User }>('/auth/me').then((r) => r.user),

  favorites: () => request<{ slugs: string[] }>('/favorites').then((r) => r.slugs),
  addFavorite: (slug: string) => request<void>(`/favorites/${encodeURIComponent(slug)}`, { method: 'PUT' }),
  removeFavorite: (slug: string) => request<void>(`/favorites/${encodeURIComponent(slug)}`, { method: 'DELETE' }),

  social: (p: { date?: string; lat?: number; lng?: number; radiusKm?: number; sport?: string; onlyOpen?: boolean; period?: string; price?: string; sort?: string }) =>
    request<SocialResponse>(`/social${qs({ ...p, onlyOpen: p.onlyOpen ? 1 : undefined })}`),
  joinSocial: (id: number, body: { name: string; phone: string; quantity: number }) =>
    request<{ session: SocialSession }>(`/social/${id}/join`, { method: 'POST', json: body }).then((r) => r.session),

  banners: () => request<{ banners: Banner[] }>('/content/banners').then((r) => r.banners),
  feed: (kind: FeedKind) => request<{ posts: FeedPost[] }>(`/content/feed?kind=${kind}`).then((r) => r.posts),
};

export interface SocialGroup {
  venue: SocialVenue & { distanceKm: number };
  sessions: (SocialSession & { live: boolean })[];
}
export interface SocialResponse {
  date: string;
  today: string;
  totalVenues: number;
  totalSessions: number;
  groups: SocialGroup[];
}
