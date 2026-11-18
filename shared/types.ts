export type SportId =
  | 'pickleball' | 'badminton' | 'football' | 'basketball' | 'tennis' | 'multi'
  | 'typti' | 'surfing' | 'swimming' | 'volleyball' | 'golf' | 'padel';

export interface PriceRow {
  fromHour: number;
  toHour: number;
  fixed: number;
  walkIn: number;
}

export interface Venue {
  id: number;
  slug: string;
  name: string;
  address: string;
  sport: SportId;
  openHour: number;
  closeHour: number;
  rating: number | null;
  lat: number;
  lng: number;
  cover: string;
  coverThumb: string;
  avatar: string;
  avatarThumb: string;
  phone: string;
  courts: string[];
  priceTable: PriceRow[];
  priceTitle: string;
  gallery: string[];
  hasEvents: boolean;
  dataSource: 'observed' | 'estimated';
}

export type SlotState = 'free' | 'booked' | 'locked' | 'event' | 'past';

export interface EventBlock {
  court: number;
  startSlot: number;
  endSlot: number;
  label: string;
  level: string;
  taken: number;
  capacity: number;
}

export interface Availability {
  venueSlug: string;
  date: string;
  startHour: number;
  slotMinutes: number;
  courts: string[];
  /** cells[court][slotIndex] */
  cells: SlotState[][];
  events: EventBlock[];
}

export interface SelectedSlot {
  court: number;
  slot: number;
}

export interface BookingLine {
  court: number;
  courtName: string;
  startSlot: number;
  endSlot: number;
  price: number;
}

export type BookingStatus = 'pending_payment' | 'paid' | 'cancelled';

export interface Booking {
  id: number;
  code: string;
  venueSlug: string;
  venueName: string;
  venueAddress: string;
  date: string;
  lines: BookingLine[];
  totalMinutes: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
}

export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
}

export interface SocialSession {
  id: number;
  venueSlug: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  level: string;
  court: string;
  taken: number;
  capacity: number;
  price: number;
  sport: SportId;
  simulated: boolean;
}

export interface SocialVenue {
  slug: string;
  name: string;
  logo: string | null;
  lat: number;
  lng: number;
  sport: SportId;
}

export type FeedKind = 'event' | 'membership' | 'course' | 'notice';

export interface FeedPost {
  id: number;
  kind: FeedKind;
  ownerName: string;
  ownerLogo: string | null;
  address: string;
  distanceKm: number;
  postedAt: string;
  text: string;
  hashtags: string[];
  items: Record<string, string | number>[];
}

export interface Banner {
  id: number;
  image: string;
  cta: string;
  link: string;
  title: string;
}
