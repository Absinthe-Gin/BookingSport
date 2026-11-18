import type { ReactNode } from 'react';
import { Icon } from '@/components/common/Icon';
import { SPORTS } from '@/constants/sports';
import { useLocation } from '@/app/providers/LocationProvider';
import type { SportId } from '@shared/types';

export interface SocialFilterState {
  onlyOpen: boolean;
  areaMode: 'radius' | 'province';
  radiusKm: number;
  province: string;
  sport: SportId | 'all';
  level: string | null;
  period: 'all' | 'morning' | 'afternoon' | 'evening';
  price: 'all' | 'free' | 'lt100' | '100to200' | 'gt200';
  sort: 'soonest' | 'nearest' | 'cheapest' | 'mostOpen' | 'busiest';
}

export const defaultSocialFilters: SocialFilterState = {
  onlyOpen: false, areaMode: 'radius', radiusKm: 20, province: '', sport: 'all', level: null, period: 'all', price: 'all', sort: 'soonest',
};

function Chip({ on, onClick, children, className = '' }: { on: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${on ? 'border-primary bg-primary-soft font-semibold text-primary' : 'border-line bg-white text-ink hover:border-primary/50'} ${className}`}>
      {children}
    </button>
  );
}

function Group({ title, children, hint }: { title: string; children?: ReactNode; hint?: string }) {
  return (
    <div className="mt-5">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {children && <div className="mt-3 flex flex-wrap gap-2.5">{children}</div>}
    </div>
  );
}

interface Props {
  value: SocialFilterState;
  onChange: (v: SocialFilterState) => void;
  levels: string[];
}

export function SocialFilters({ value: f, onChange, levels }: Props) {
  const { locate } = useLocation();
  const set = <K extends keyof SocialFilterState>(k: K, v: SocialFilterState[K]) => onChange({ ...f, [k]: v });
  const dirty = JSON.stringify(f) !== JSON.stringify(defaultSocialFilters);

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon name="sliders" size={20} className="rotate-90 text-ink" />
        <h2 className="flex-1 text-lg font-semibold text-ink">Bộ lọc</h2>
        <button type="button" onClick={locate} className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-ink hover:border-primary">
          <Icon name="locate" size={16} className="text-primary" />Gần tôi
        </button>
        <button type="button" onClick={() => onChange(defaultSocialFilters)} disabled={!dirty}
          className="flex h-9 items-center gap-1.5 rounded-full bg-[#ececec] px-3 text-sm text-ink disabled:text-[#b5b5b5]">
          <Icon name="refresh" size={16} />Đặt lại
        </button>
      </div>
      <label className="mt-4 flex cursor-pointer items-center justify-between border-b border-line pb-4 text-[15px] text-ink">
        Chỉ hiện buổi còn chỗ
        <input type="checkbox" role="switch" checked={f.onlyOpen} onChange={(e) => set('onlyOpen', e.target.checked)} className="peer sr-only" />
        <span aria-hidden="true" className="relative h-6 w-11 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-brand-green after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-brand-green" />
      </label>

      <Group title="Khu vực" />
      <div className="mt-3 grid grid-cols-2 rounded-lg bg-[#f0f0f0] p-1">
        {([['radius', 'Theo bán kính', 'locate'], ['province', 'Theo tỉnh/thành', 'court']] as const).map(([k, label, icon]) => (
          <button key={k} type="button" onClick={() => set('areaMode', k)} aria-pressed={f.areaMode === k}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-md text-sm ${f.areaMode === k ? 'bg-white font-semibold text-primary shadow-card' : 'text-muted'}`}>
            <Icon name={icon} size={16} />{label}
          </button>
        ))}
      </div>
      {f.areaMode === 'radius' ? (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {[5, 10, 20, 30].map((km) => <Chip key={km} on={f.radiusKm === km} onClick={() => set('radiusKm', km)}>Trong {km} km</Chip>)}
        </div>
      ) : (
        <select aria-label="Tỉnh/thành" value={f.province} onChange={(e) => set('province', e.target.value)} className="mt-3 h-10 w-full rounded-lg border border-line px-3 text-sm">
          <option value="">Tất cả tỉnh/thành</option>
          <option>Hà Nội</option>
          <option>TP Hồ Chí Minh</option>
        </select>
      )}

      <Group title="Môn thể thao">
        <Chip on={f.sport === 'all'} onClick={() => onChange({ ...f, sport: 'all', level: null })}><Icon name="list" size={16} />Tất cả môn</Chip>
        {SPORTS.map((s) => (
          <Chip key={s.id} on={f.sport === s.id} onClick={() => onChange({ ...f, sport: s.id, level: null })}>
            <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M7 15.5S1 10.4 1 6.3a6 6 0 0 1 12 0c0 4.1-6 9.2-6 9.2z" fill={s.color} /><circle cx="7" cy="6.2" r="2.4" fill="#fff" /></svg>
            {s.label}
          </Chip>
        ))}
      </Group>

      <Group title="Trình độ" hint={f.sport === 'all' ? 'Chọn môn thể thao để lọc theo trình độ' : levels.length ? undefined : 'Chưa có trình độ cho môn này'}>
        {f.sport !== 'all' && levels.map((l) => <Chip key={l} on={f.level === l} onClick={() => set('level', f.level === l ? null : l)}>{l}</Chip>)}
      </Group>

      <Group title="Buổi chơi">
        {([['all', 'Cả ngày'], ['morning', 'Sáng'], ['afternoon', 'Chiều'], ['evening', 'Tối']] as const).map(([k, l]) => <Chip key={k} on={f.period === k} onClick={() => set('period', k)}>{l}</Chip>)}
      </Group>
      <Group title="Khoảng giá">
        {([['all', 'Tất cả mức giá'], ['free', 'Miễn phí'], ['lt100', 'Dưới 100.000đ'], ['100to200', '100.000đ - 200.000đ'], ['gt200', 'Trên 200.000đ']] as const).map(([k, l]) => <Chip key={k} on={f.price === k} onClick={() => set('price', k)}>{l}</Chip>)}
      </Group>
      <Group title="Sắp xếp">
        {([['soonest', 'Sắp diễn ra'], ['nearest', 'Gần nhất'], ['cheapest', 'Giá thấp nhất'], ['mostOpen', 'Còn nhiều chỗ nhất'], ['busiest', 'Đông người chơi nhất']] as const).map(([k, l]) => <Chip key={k} on={f.sort === k} onClick={() => set('sort', k)}>{l}</Chip>)}
      </Group>
    </div>
  );
}
