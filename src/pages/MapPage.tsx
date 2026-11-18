import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { ErrorState } from '@/components/feedback/States';
import { VenueDetailPanel } from '@/features/venues/components/VenueDetailPanel';
import { BookingTypeModal } from '@/features/venues/components/BookingTypeModal';
import { useAsync } from '@/hooks/useAsync';
import { useLocation } from '@/app/providers/LocationProvider';
import { api, type VenueWithDistance } from '@/services/api';
import { SPORTS, sportColor } from '@/constants/sports';
import { formatDistance } from '@shared/schedule';
import type { SportId } from '@shared/types';

const markerCache = new Map<string, L.Icon | L.DivIcon>();
function markerFor(sport: SportId, active: boolean) {
  const key = `${sport}-${active}`;
  if (!markerCache.has(key)) {
    markerCache.set(key, sport === 'pickleball'
      ? L.icon({ iconUrl: '/assets/icons/marker_pickleball.png', iconSize: active ? [46, 54] : [36, 42], iconAnchor: active ? [23, 54] : [18, 42] })
      : L.divIcon({ className: '', iconSize: [30, 38], iconAnchor: [15, 38],
          html: `<svg width="30" height="38" viewBox="0 0 14 18"><path d="M7 17.5S.5 11.6.5 6.8a6.5 6.5 0 0 1 13 0C13.5 11.6 7 17.5 7 17.5z" fill="${sportColor(sport)}" stroke="#fff" stroke-width="1"/><circle cx="7" cy="6.8" r="2.6" fill="#fff"/></svg>` }));
  }
  return markerCache.get(key)!;
}

const userIcon = L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<span style="display:block;width:18px;height:18px;border-radius:50%;background:#1f6feb;border:3px solid #fff;box-shadow:0 0 0 6px rgb(31 111 235 / .2)"></span>' });

function MapControls({ onList, center }: { onList: () => void; center: [number, number] }) {
  const map = useMap();
  const { locate } = useLocation();
  useEffect(() => { map.setView(center); }, [map, center]);
  const btn = 'flex h-11 w-11 items-center justify-center bg-white text-ink hover:bg-primary-soft';
  return (
    <div className="absolute right-4 bottom-6 z-[400] flex flex-col items-end gap-3">
      <div className="overflow-hidden rounded-lg shadow-bar">
        <button type="button" className={btn} onClick={() => map.zoomIn()} aria-label="Phóng to"><Icon name="plus" size={20} /></button>
        <div className="h-px bg-line" />
        <button type="button" className={btn} onClick={() => map.zoomOut()} aria-label="Thu nhỏ"><Icon name="minus" size={20} /></button>
      </div>
      <button type="button" className={`${btn} rounded-lg shadow-bar`} onClick={onList} aria-label="Danh sách sân"><Icon name="list" size={20} /></button>
      <button type="button" className={`${btn} rounded-lg shadow-bar`} onClick={locate} aria-label="Vị trí của tôi"><Icon name="locate" size={22} /></button>
    </div>
  );
}

function FocusVenue({ venue }: { venue?: VenueWithDistance }) {
  const map = useMap();
  useEffect(() => { if (venue) map.panTo([venue.lat, venue.lng]); }, [map, venue]);
  return null;
}

function VenuePreview({ venue, onOpen, onBook, onClose }: { venue: VenueWithDistance; onOpen: () => void; onBook: () => void; onClose: () => void }) {
  return (
    <div className="absolute bottom-6 left-1/2 z-[450] flex w-[min(520px,calc(100%-24px))] -translate-x-1/2 items-center gap-3 rounded-xl bg-white p-3 shadow-bar">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <Avatar src={venue.avatarThumb} name={venue.name} size={52} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold text-ink">{venue.name}</span>
          <span className="block truncate text-xs text-muted"><span className="text-distance">({formatDistance(venue.distanceKm)})</span> {venue.address}</span>
        </span>
      </button>
      <button type="button" onClick={onBook} className="h-[30px] shrink-0 rounded bg-accent px-3 text-[13px] font-bold text-white">ĐẶT LỊCH</button>
      <button type="button" onClick={onClose} aria-label="Đóng" className="text-muted"><Icon name="x" size={18} /></button>
    </div>
  );
}

export default function MapPage() {
  const { location } = useLocation();
  const [q, setQ] = useState('');
  const [sport, setSport] = useState<SportId | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [book, setBook] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const venues = useAsync(() => api.venues({ q, sports: sport ? [sport] : [], lat: location.lat, lng: location.lng }), [q, sport, location.lat, location.lng]);
  const center = useMemo<[number, number]>(() => [location.lat, location.lng], [location.lat, location.lng]);
  const sel = venues.data?.find((v) => v.slug === selected);
  const closePanel = useCallback(() => setPanel(null), []);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
      <MapContainer center={center} zoom={15} zoomControl={false} className="h-full w-full" attributionControl>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        <Marker position={center} icon={userIcon} />
        {venues.data?.map((v) => (
          <Marker key={v.slug} position={[v.lat, v.lng]} icon={markerFor(v.sport, v.slug === selected)} title={v.name}
            eventHandlers={{ click: () => setSelected(v.slug) }} />
        ))}
        <MapControls center={center} onList={() => setListOpen((o) => !o)} />
        <FocusVenue venue={sel} />
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-col gap-2 p-2.5 lg:flex-row lg:items-center">
        <form className="pointer-events-auto flex h-[52px] w-full items-center gap-2 rounded-full bg-white px-4 shadow-bar lg:w-[565px] lg:shrink-0"
          onSubmit={(e) => { e.preventDefault(); setQ(String(new FormData(e.currentTarget).get('q') ?? '').trim()); }}>
          <img src="/assets/icons/ic_alobo.png" alt="" className="h-7 w-7 rounded-full" />
          <label htmlFor="map-q" className="sr-only">Tìm kiếm sân quanh đây</label>
          <input id="map-q" name="q" type="search" placeholder="Tìm kiếm sân quanh đây." className="min-w-0 flex-1 text-[15px] outline-none placeholder:text-[#9aa29e]" />
          <button type="submit" aria-label="Tìm kiếm" className="text-ink"><Icon name="search" size={22} strokeWidth={2.2} /></button>
        </form>
        <div className="no-scrollbar pointer-events-auto flex gap-2.5 overflow-x-auto pb-1">
          {SPORTS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSport(sport === s.id ? null : s.id)} aria-pressed={sport === s.id}
              className={`flex h-[38px] shrink-0 items-center gap-2 rounded-full px-3.5 text-[15px] shadow-card ${sport === s.id ? 'bg-primary text-white' : 'bg-white text-ink'}`}>
              <svg width="16" height="18" viewBox="0 0 14 16" aria-hidden="true"><path d="M7 15.5S1 10.4 1 6.3a6 6 0 0 1 12 0c0 4.1-6 9.2-6 9.2z" fill={s.color} /><circle cx="7" cy="6.2" r="2.4" fill="#fff" /></svg>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {venues.error && <div className="absolute inset-x-0 top-32 z-[500] mx-auto max-w-md rounded-xl bg-white shadow-bar"><ErrorState message={venues.error.message} onRetry={venues.reload} /></div>}

      {listOpen && (
        <aside aria-label="Danh sách sân trên bản đồ" className="animate-slide-left absolute top-0 bottom-0 left-0 z-[600] w-full max-w-[380px] overflow-y-auto bg-white shadow-2xl">
          <header className="sticky top-0 flex h-14 items-center justify-between bg-primary px-4 text-white">
            <h2 className="text-lg font-bold">{venues.data?.length ?? 0} sân quanh đây</h2>
            <button type="button" onClick={() => setListOpen(false)} aria-label="Đóng danh sách"><Icon name="x" size={22} /></button>
          </header>
          <ul>
            {venues.data?.map((v) => (
              <li key={v.slug}>
                <button type="button" onClick={() => { setSelected(v.slug); setListOpen(false); }} className="flex w-full items-center gap-3 border-b border-line p-3 text-left hover:bg-primary-soft">
                  <Avatar src={v.avatarThumb} name={v.name} size={44} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">{v.name}</span>
                    <span className="block truncate text-xs text-muted"><span className="text-distance">({formatDistance(v.distanceKm)})</span> {v.address}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {sel && <VenuePreview venue={sel} onOpen={() => setPanel(sel.slug)} onBook={() => setBook(sel.slug)} onClose={() => setSelected(null)} />}
      {panel && <VenueDetailPanel slug={panel} onClose={closePanel} onBook={setBook} />}
      <BookingTypeModal slug={book} onClose={() => setBook(null)} />
    </div>
  );
}
