import { useMemo, useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/feedback/States';
import { useAsync } from '@/hooks/useAsync';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useLocation } from '@/app/providers/LocationProvider';
import { api, type SocialGroup } from '@/services/api';
import { addDays, dateRange, ddmm, ddmmyyyy, todayLocal, weekdayShort } from '@/utils/date';
import type { SocialSession } from '@shared/types';
import { SocialFilters, defaultSocialFilters, type SocialFilterState } from './SocialFilters';
import { TicketCard } from './TicketCard';
import { JoinModal } from './JoinModal';

type Session = SocialGroup['sessions'][number];
const DAYS = 14;

function DateCard({ value, onChange, today }: { value: string; onChange: (d: string) => void; today: string }) {
  const days = dateRange(today, DAYS);
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink">Ngày tổ chức</h2>
        <label className="relative flex h-8 cursor-pointer items-center gap-2 rounded-lg bg-primary-soft px-3 text-sm font-semibold text-primary">
          {ddmm(today)} - {ddmmyyyy(addDays(today, DAYS - 1))}
          <Icon name="calendar" size={16} />
          <input type="date" aria-label="Chọn ngày" min={today} max={addDays(today, DAYS - 1)} value={value} onChange={(e) => e.target.value && onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="listbox" aria-label="Ngày tổ chức">
        {days.map((d) => {
          const on = d === value;
          return (
            <button key={d} type="button" role="option" aria-selected={on} onClick={() => onChange(d)}
              className={`flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-xl border leading-tight ${on ? 'border-primary bg-primary text-white' : 'border-line text-ink hover:border-primary/50'}`}>
              <span className="text-xs">{d === today ? 'Hôm nay' : weekdayShort(d).replace('T', 'Th ')}</span>
              <span className="text-lg font-bold">{d.slice(8)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function timeChips(sessions: Session[]) {
  const map = new Map<string, Session[]>();
  for (const s of sessions) map.set(s.startTime, [...(map.get(s.startTime) ?? []), s]);
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function VenueGroupCard({ group, onJoin, onMore }: { group: SocialGroup; onJoin: (s: Session) => void; onMore: () => void }) {
  const chips = timeChips(group.sessions);
  const [time, setTime] = useState<string | null>(null);
  const shown = time ? group.sessions.filter((s) => s.startTime === time) : group.sessions;
  return (
    <article className="min-w-0 rounded-2xl border border-line bg-white p-3">
      <div className="flex items-center gap-3">
        <Avatar src={group.venue.logo} name={group.venue.name} size={48} className="rounded-lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-semibold text-ink">{group.venue.name}</h3>
          <p className="flex items-center gap-1 text-[13px] text-muted"><Icon name="map-pin" size={14} />{group.venue.distanceKm.toFixed(1).replace('.', ',')} km · {group.sessions.length} lịch</p>
        </div>
        <button type="button" onClick={onMore} className="h-10 shrink-0 rounded-lg bg-primary-soft px-3.5 text-sm font-semibold text-primary">Xem thêm</button>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {chips.map(([t, list]) => {
          const on = time === t;
          const label = list.length === 1 ? `${list[0].taken}/${list[0].capacity} chỗ` : `${list.length} lịch`;
          return (
            <button key={t} type="button" onClick={() => setTime(on ? null : t)} aria-pressed={on}
              className={`flex h-[52px] w-[56px] shrink-0 flex-col items-center justify-center rounded-xl border leading-tight ${on ? 'border-primary bg-primary-soft text-primary' : 'border-line text-ink'}`}>
              <span className="text-[15px] font-semibold">{t}</span>
              <span className="text-[10px] text-muted">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
        {shown.map((s) => <TicketCard key={s.id} session={s} onJoin={() => onJoin(s)} onOpen={() => onJoin(s)} />)}
      </div>
    </article>
  );
}

interface Props {
  query?: string;
}

/** Social sessions with filters, date picker and venue / time views. Used by Explore and "Social gần đây". */
export function SocialBoard({ query = '' }: Props) {
  const { location } = useLocation();
  const isDesktop = useIsDesktop();
  const today = todayLocal();
  const [date, setDate] = useState(today);
  const [filters, setFilters] = useState<SocialFilterState>(defaultSocialFilters);
  const [view, setView] = useState<'venue' | 'time'>('venue');
  const [joining, setJoining] = useState<{ session: Session; venue: string } | null>(null);
  const [more, setMore] = useState<SocialGroup | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const res = useAsync(() => api.social({
    date, lat: location.lat, lng: location.lng,
    radiusKm: filters.areaMode === 'radius' ? filters.radiusKm : 1000,
    sport: filters.sport, onlyOpen: filters.onlyOpen, period: filters.period, price: filters.price, sort: filters.sort,
  }), [date, location.lat, location.lng, filters.areaMode, filters.radiusKm, filters.sport, filters.onlyOpen, filters.period, filters.price, filters.sort]);

  const levels = useMemo(() => [...new Set((res.data?.groups ?? []).flatMap((g) => g.sessions.map((s) => s.level)))].sort(), [res.data]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Every social venue in the data is in Hà Nội.
    if (filters.areaMode === 'province' && filters.province === 'TP Hồ Chí Minh') return [];
    return (res.data?.groups ?? [])
      .filter((g) => !q || g.venue.name.toLowerCase().includes(q) || g.sessions.some((s) => s.title.toLowerCase().includes(q)))
      .map((g) => ({ ...g, sessions: g.sessions.filter((s) => !filters.level || s.level === filters.level) }))
      .filter((g) => g.sessions.length);
  }, [res.data, query, filters.level, filters.areaMode, filters.province]);

  const total = groups.reduce((n, g) => n + g.sessions.length, 0);
  const byTime = useMemo(() => {
    const all = groups.flatMap((g) => g.sessions.map((s) => ({ s, venue: g.venue.name })));
    return timeChips(all.map((x) => x.s)).map(([t, list]) => [t, list.map((s) => all.find((x) => x.s === s)!)] as const);
  }, [groups]);

  const applyJoin = (updated: SocialSession) => res.setData((d) => d && ({
    ...d, groups: d.groups.map((g) => ({ ...g, sessions: g.sessions.map((s) => (s.id === updated.id ? { ...s, taken: updated.taken } : s)) })),
  }));

  const filterPanel = <SocialFilters value={filters} onChange={setFilters} levels={levels} />;

  return (
    <div className="flex gap-6 px-3 py-5 lg:px-6">
      {isDesktop && <aside className="w-[400px] shrink-0">{filterPanel}</aside>}
      <div className="min-w-0 flex-1 space-y-4">
        <DateCard value={date} onChange={setDate} today={today} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[17px] font-semibold text-primary-deep" aria-live="polite">{groups.length} sân · {total} buổi chơi</p>
          <div className="flex items-center gap-2">
            {!isDesktop && (
              <button type="button" onClick={() => setFiltersOpen(true)} className="flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm"><Icon name="sliders" size={16} />Bộ lọc</button>
            )}
            <div className="flex rounded-full border border-line bg-white p-1" role="group" aria-label="Kiểu hiển thị">
              <button type="button" onClick={() => setView('venue')} aria-pressed={view === 'venue'} aria-label="Theo sân" title="Theo sân"
                className={`flex h-8 w-9 items-center justify-center rounded-full ${view === 'venue' ? 'bg-primary-soft text-primary' : 'text-muted'}`}><Icon name="court" size={18} /></button>
              <button type="button" onClick={() => setView('time')} aria-pressed={view === 'time'} aria-label="Theo khung giờ" title="Theo khung giờ"
                className={`flex h-8 w-9 items-center justify-center rounded-full ${view === 'time' ? 'bg-primary-soft text-primary' : 'text-muted'}`}><Icon name="clock" size={18} /></button>
            </div>
          </div>
        </div>

        {res.loading && !res.data ? <LoadingBlock /> : res.error ? <ErrorState message={res.error.message} onRetry={res.reload} />
          : !groups.length ? <EmptyState message="Không có buổi chơi phù hợp. Hãy thử đổi ngày hoặc bộ lọc." />
          : view === 'venue' ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {groups.map((g) => (
                <VenueGroupCard key={g.venue.slug} group={g} onMore={() => setMore(g)} onJoin={(s) => setJoining({ session: s, venue: g.venue.name })} />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {byTime.map(([t, list]) => (
                <section key={t}>
                  <h3 className="mb-2 text-[15px] font-bold text-primary">{t}</h3>
                  <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                    {list.map(({ s, venue }) => (
                      <div key={s.id}>
                        <p className="mb-1 max-w-[440px] truncate text-xs text-muted">{venue}</p>
                        <TicketCard session={s} onJoin={() => setJoining({ session: s, venue })} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} className="max-w-[460px] bg-transparent">
        {filterPanel}
        <button type="button" onClick={() => setFiltersOpen(false)} className="mt-2 h-11 w-full rounded-lg bg-primary font-bold text-white">Xem {total} buổi chơi</button>
      </Modal>
      <Modal open={!!more} onClose={() => setMore(null)} title={more?.venue.name} className="max-w-[520px]">
        <div className="space-y-3 p-4">
          {more?.sessions.map((s) => <TicketCard key={s.id} session={s} onJoin={() => { setJoining({ session: s, venue: more.venue.name }); setMore(null); }} />)}
        </div>
      </Modal>
      <JoinModal session={joining?.session ?? null} venueName={joining?.venue ?? ''} onClose={() => setJoining(null)} onJoined={applyJoin} />
    </div>
  );
}
