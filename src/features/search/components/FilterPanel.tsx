import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { Sheet } from '@/components/common/Modal';
import { SPORTS } from '@/constants/sports';
import { DISTANCES, PROVINCES, defaultFilters, type SearchFilters } from '../filters';

function SportPin({ color }: { color: string }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path d="M7 15.5S1 10.4 1 6.3a6 6 0 0 1 12 0c0 4.1-6 9.2-6 9.2z" fill={color} />
      <circle cx="7" cy="6.2" r="2.4" fill="#fff" />
    </svg>
  );
}

function Title({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="mb-3 flex items-center justify-between"><h3 className="text-[17px] font-semibold text-ink">{children}</h3>{right}</div>;
}

interface Props {
  open: boolean;
  value: SearchFilters;
  onClose: () => void;
  onApply: (f: SearchFilters) => void;
}

/** Right-hand "Tìm kiếm" panel with sport, booking type, area/distance and keyword filters. */
export function FilterPanel({ open, value, onClose, onApply }: Props) {
  const navigate = useNavigate();
  const [f, setF] = useState(value);
  const [synced, setSynced] = useState(value);
  if (open && synced !== value) { setSynced(value); setF(value); }

  const toggleSport = (id: SearchFilters['sports'][number]) =>
    setF((s) => ({ ...s, sports: s.sports.includes(id) ? s.sports.filter((x) => x !== id) : [...s.sports, id] }));
  const wards = PROVINCES.find((p) => p.name === f.province)?.wards ?? [];

  const keyword = (k: 'social' | 'pickleball' | 'badminton' | 'ticket') => {
    if (k === 'social' || k === 'ticket') { onClose(); navigate('/socialNearby'); return; }
    onApply({ ...defaultFilters, sports: [k], areaMode: 'distance', maxKm: 5 });
  };

  const apply = () => {
    if (f.kind !== 'free') { onClose(); navigate('/socialNearby'); return; }
    onApply(f);
  };

  return (
    <Sheet open={open} onClose={onClose} side="right" label="Bộ lọc tìm kiếm" className="flex w-full max-w-[490px] flex-col bg-[#eef8f2]">
      <header className="flex h-14 items-center px-2">
        <button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="flex h-12 w-12 items-center justify-center text-primary"><Icon name="chevron-left" size={24} strokeWidth={2.6} /></button>
        <h2 className="flex-1 text-center text-xl font-bold text-primary">Tìm kiếm</h2>
        <button type="button" onClick={() => setF(defaultFilters)} aria-label="Đặt lại bộ lọc" className="flex h-12 w-12 items-center justify-center text-brand-green"><Icon name="refresh" size={22} strokeWidth={2.4} /></button>
      </header>

      <div className="mx-3 flex-1 overflow-y-auto rounded-lg bg-white p-3">
        <Title right={
          <button type="button" onClick={() => setF((s) => ({ ...s, sports: [] }))} aria-pressed={!f.sports.length}
            className={`flex items-center gap-1 rounded-full border px-3 py-0.5 text-sm ${!f.sports.length ? 'border-brand-green bg-brand-green text-white' : 'border-brand-green text-brand-green'}`}>
            <Icon name="plus" size={14} strokeWidth={2.6} />Tất cả
          </button>
        }>Môn thể thao</Title>
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-2.5 sm:grid-cols-4">
          {SPORTS.map((s) => {
            const on = f.sports.includes(s.id);
            return (
              <button key={s.id} type="button" onClick={() => toggleSport(s.id)} aria-pressed={on}
                className="flex h-[30px] items-center justify-center gap-1 rounded-full border text-sm"
                style={{ borderColor: s.color, color: on ? '#fff' : s.color, background: on ? s.color : '#fff' }}>
                <SportPin color={on ? '#fff' : s.color} />{s.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5"><Title>Loại lịch</Title></div>
        <div className="grid grid-cols-3 gap-3">
          {([['free', 'Sân trống'], ['event', 'Sự kiện / Xé vé'], ['team', 'Ghép đội']] as const).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setF((s) => ({ ...s, kind: k }))} aria-pressed={f.kind === k}
              className={`h-[42px] rounded border text-sm ${f.kind === k ? 'border-primary bg-primary-soft font-semibold text-primary' : 'border-line text-muted'}`}>
              {label}
            </button>
          ))}
        </div>

        <fieldset className="mt-5">
          <legend className="sr-only">Phạm vi</legend>
          <label className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <input type="radio" name="area" checked={f.areaMode === 'area'} onChange={() => setF((s) => ({ ...s, areaMode: 'area', maxKm: null }))} className="h-5 w-5 accent-brand-green" />
            Khu vực
          </label>
          <div className={`mt-3 flex gap-2.5 ${f.areaMode !== 'area' ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex h-[42px] flex-1 overflow-hidden rounded border border-line">
              <select aria-label="Tỉnh/TP" value={f.province} onChange={(e) => setF((s) => ({ ...s, province: e.target.value, ward: '' }))}
                className="min-w-0 flex-1 bg-white px-2 text-center text-sm text-muted outline-none">
                <option value="">Tỉnh/TP</option>
                {PROVINCES.map((p) => <option key={p.name}>{p.name}</option>)}
              </select>
              <select aria-label="Phường/Xã" value={f.ward} onChange={(e) => setF((s) => ({ ...s, ward: e.target.value }))} disabled={!f.province}
                className="min-w-0 flex-1 border-l border-line bg-white px-2 text-center text-sm text-muted outline-none">
                <option value="">Phường/Xã</option>
                {wards.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setF((s) => ({ ...s, favoritesOnly: !s.favoritesOnly }))} aria-pressed={f.favoritesOnly} aria-label="Chỉ sân yêu thích"
              className={`flex h-[42px] w-[42px] items-center justify-center rounded border ${f.favoritesOnly ? 'border-primary bg-primary text-white' : 'border-line text-primary'}`}>
              <Icon name={f.favoritesOnly ? 'heart-fill' : 'heart'} size={22} />
            </button>
          </div>
          <label className="mt-4 flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <input type="radio" name="area" checked={f.areaMode === 'distance'} onChange={() => setF((s) => ({ ...s, areaMode: 'distance', maxKm: s.maxKm ?? 5, province: '', ward: '' }))} className="h-5 w-5 accent-brand-green" />
            Khoảng cách
          </label>
          {f.areaMode === 'distance' && (
            <div className="mt-3 flex flex-wrap gap-2">
              {DISTANCES.map((d) => (
                <button key={d} type="button" onClick={() => setF((s) => ({ ...s, maxKm: d }))} aria-pressed={f.maxKm === d}
                  className={`h-9 rounded-md border px-3 text-sm ${f.maxKm === d ? 'border-primary bg-primary-soft font-semibold text-primary' : 'border-line text-ink'}`}>
                  Trong {d} km
                </button>
              ))}
            </div>
          )}
        </fieldset>

        <div className="mt-5"><Title>Từ khoá</Title></div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => keyword('social')} className="flex h-9 items-center gap-2 rounded bg-primary px-3 text-[15px] font-semibold text-white"><Icon name="navigation" size={16} />Social gần đây</button>
          <button type="button" onClick={() => keyword('pickleball')} className="h-9 rounded bg-[#ececec] px-3 text-[15px] text-ink">Pickleball gần tôi</button>
          <button type="button" onClick={() => keyword('badminton')} className="h-9 rounded bg-[#ececec] px-3 text-[15px] text-ink">Cầu lông gần tôi</button>
          <button type="button" onClick={() => keyword('ticket')} className="h-9 rounded bg-[#ececec] px-3 text-[15px] text-ink">Xé vé gần tôi</button>
        </div>
      </div>

      <div className="p-2.5">
        <button type="button" onClick={apply} className="h-[50px] w-full rounded-md bg-[#0aa83f] text-[17px] font-bold text-white hover:brightness-95">Tìm kiếm</button>
      </div>
    </Sheet>
  );
}
